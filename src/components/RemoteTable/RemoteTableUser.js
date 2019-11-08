import React, {Component} from "react";
import MaterialTable from 'material-table'
import Button from "@material-ui/core/Button/Button";
//import Modal from "@material-ui/core/Modal/Modal";
//import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import CopyToClipboard from "react-copy-to-clipboard";
import userService from "../../services/user.service";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import history from "../../history";

class RemoteTableUser extends Component{

    constructor (props){
        super(props);
        this.serverApi = process.env.REACT_APP_API_LOCATION;
        this.methods = {
            show    : this.serverApi+'/user/getusers?',
            delete  : this.serverApi+'/user/delete/',
            edit    : this.serverApi+'/user/update/',
            roles   : this.serverApi+'/roles/getall/'
        };
        this.query = "";
        this.state = {
            columns: [],
            data :[],
            rol: '',
            initialRoles : [],
            name : '',
            email : '',
            address: '',
            password: '',
            error: '',
            open : false,
        };
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
        };

    }


    componentDidMount() {
        let roles = [];
        let $params = {
            method  : "get",
            headers : this.headers
        };
        let $url = this.methods.roles;
        fetch($url,$params)
            .then(response => {
                return response.json();
            }).then(result => {
            roles = result.data;
            let objectRol = {};
            roles.map((item, key) =>
                objectRol[item.name] = item.name,

            );
            this.setState({
                columns: [
                    { title: "id", field: "id", editable: 'never' },
                    { title: "Nombre", field: "name" },
                    { title: "Email", field: "email" },
                    { title: "Direccion", field: "address"},
                    { title: "Rol", field: "roles[0].name", lookup:objectRol , defaultFilter: ["roles[0].name"], },
                    { title: "Creación", field: "created_at", editable: 'never' },
                ],
                initialRoles : roles,
            });
        });
    }

    // Modal
    handleClickOpen = () => {
        this.setState({open:true});
    };
    handleClose = () => {
        this.setState({open:false});
    };

    // Genera el password aleatorio
    generatePws = () => {
        var pass = require("randomstring");
        this.setState({ password: pass.generate(7) });
    };

    //Cacha los valores de los input y se los asigna a las constantes
    handleNameChange = (e) => {
            this.setState({name: e.target.value })
    };
    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    };
    handleAddressChange = (e) => {
        this.setState({address: e.target.value});
    };
    handleRolChange = (e) => {
        this.setState({rol: e.target.value});
        console.log(this.state.rol);
    };

    // Crea el usuario
    handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, address, password, rol} = this.state;

        // valida campos
        if (!(name && password && address && email && rol)) {
            return;
        }
        userService.addUser(name, email, password, address, rol)
            .then(
                resutl => {
                    if (resutl.status === "success") {
                        const  from  = { from: { pathname: "/admin/usuarios" } };
                        this.setState({open:false});
                        history.push(from);
                        window.location.reload();
                    }
                },
                error => this.setState({error: error})
            );
    };

    // Trae los usuarios de api
    show($query){
        this.query = $query;
        let $return;
        $return = new Promise((resolve, reject) => {
            let $url = this.methods.show;
            $url += "per_page="+this.query.pageSize+"&page="+(this.query.page+1);
            let $params = {
                method  : "get",
                headers : this.headers
            }
            fetch($url,$params)
                .then(response => response.json())
                .then(result => {
                    resolve({
                        data: result.data,
                        page: (result.current_page-1),
                        totalCount:result.total
                    });
                });
        });

        return $return;
    }

    // Elimina usuario de api
    delete($oldData){
        let $return;
        $oldData['per_page']= this.query.totalCount;
        let $params = {
            method: "GET",
            headers: this.headers
        };

        $return =  new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.delete+$oldData.id;
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(result.success){
                            this.cache = {
                                data: result.data[0].data,
                                page: result.data[0].current_page-1,
                                totalCount: result.data[0].total
                            }
                        }else{

                        }
                        resolve(this.cache);
                    })
                    .catch(error => {
                        resolve(this.cache);
                    });
            }, 600);
        });

        return $return;
    }

    // Edita usuario de api
    edit(newData,oldData){
        let $return;
        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(newData)
        };

        $return = new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.edit+oldData.id;
                console.log(oldData);
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(!result.success){

                        }
                        resolve();
                    })
                    .catch(error => {
                        resolve(this.cache);
                    });
            }, 600);
        });
        return $return;
    }

    render(){
        const paper = {
            marginTop: "8px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        };        
        const submit = {
            margin: "0px",
            marginTop:"5px",
            marginBottom:"10px",
        };
        const genPws = {
            marginTop:"24px",
        };
        const snackbarWarning = {
            margin: "0px",
            marginTop:"5px",
            marginBottom:"10px",
            backgroundColor: "#F27458"
        };

        return (
            <div>
                <Button
                    variant="contained"
                    margin="normal"
                    color="primary"                    
                    onClick={this.handleClickOpen}
                    style={submit}
                >
                    Crear usuario
                </Button>
                <Dialog maxWidth="lg" open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" >
                    <form onSubmit={this.handleSubmit}>
                    <DialogTitle id="form-dialog-title">Crear usuario</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                           Complete los campos
                        </DialogContentText>
                        <div className={paper}>
                            {this.state.error &&
                            <div>
                                <SnackbarContent
                                    message={this.state.error}
                                    style={snackbarWarning}
                                />
                            </div>
                            }

                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            type="text"
                                            id="name"
                                            label="Nombre Completo"
                                            name="name"
                                            autoComplete="nombre"
                                            autoFocus
                                            onChange={this.handleNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            type="email"
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            onChange={this.handleEmailChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            type="text"
                                            id="direccion"
                                            label="Direccion"
                                            name="address"
                                            autoComplete="address"
                                            onChange={this.handleAddressChange}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="password"
                                            name="password"
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            label="Password"
                                            value={this.state.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CopyToClipboard text={this.state.password}>
                                                            <Button
                                                                variant="contained"
                                                            >
                                                                Copy
                                                            </Button>
                                                        </CopyToClipboard>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Button
                                            variant="contained"
                                            margin="normal"
                                            color="primary"
                                            style={genPws}
                                            onClick={this.generatePws}
                                        >
                                            Generar
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id = "rol"
                                            name = "rol"
                                            select
                                            label="Rol"
                                            onChange={this.handleRolChange}
                                            value={this.state.rol}
                                            SelectProps={{
                                                MenuProps: {
                                                },
                                            }}
                                            margin="normal"
                                            variant="outlined"
                                        >
                                            {this.state.initialRoles.map(option => (
                                                <MenuItem key={option.name} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                    </Grid>
                                </Grid>

                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancelar
                        </Button>
                        <Button type="submit"
                                variant="contained"
                                color="primary"
                                style={submit}
                        >
                            Crear
                        </Button>

                    </DialogActions>
                    </form>
                </Dialog>
                <MaterialTable
                    title={this.props.title}
                    columns={ this.state.columns }
                    data={ $query => this.show($query)}
                    editable={{
                        onRowUpdate: (newData, oldData) => this.edit(newData,oldData),
                        onRowDelete: oldData => this.delete(oldData)
                    }}
                    options={{
                        pageSize: 20,
                        debounceInterval: 500,
                        search: true,
                        sorting: true,
                        actionsColumnIndex: -1,
                        rowStyle: {
                            backgroundColor: '#EEE',
                        }
                    }}
                    localization={{
                        body: {
                            editRow: {
                                deleteText : "¿Realmente desea eliminar el registro?",
                                cancelTooltip : "Cancelar",
                                saveTooltip: "Proceder"
                            },
                        }
                    }}
                />
            </div>
        );
    }
}
export default RemoteTableUser;