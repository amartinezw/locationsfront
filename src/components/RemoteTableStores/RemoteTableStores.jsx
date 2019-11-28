import React from 'react';
import MaterialTable from 'material-table';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../Snackbar/SnackbarFancy";
import materialTableLocaleES from '../MaterialTableLocaleES';

export default class RemoteTableStores extends React.Component{

    constructor (props){
        super(props);
        this.methods = {
            show    : process.env.REACT_APP_API_LOCATION+'/warehouses/getall?',
            add     : process.env.REACT_APP_API_LOCATION+'/warehouses/store?',
            delete  : process.env.REACT_APP_API_LOCATION+'/warehouses/destroy?',
            edit    : process.env.REACT_APP_API_LOCATION+'/warehouses/update?',
            select  : process.env.REACT_APP_API_LOCATION+'/stores/getallstores?column=number&order=asc',
        }
        this.stores = [];
        this.query = "";
        this.state = {
            openSnack   : false,
            selectValue : {},
            msg         : {msg:"",typeMsg:"info"},
            columns     : [
                { title: 'Num. Tienda', field: 'store.number', type: 'numeric',editable:"never"},
                {
                    title: 'Nombre de la tienda',
                    field: 'store.name',
                    editComponent: props => (
                        <Autocomplete
                            options={this.stores}
                            getOptionLabel={option => option.name}
                            onChange={(event, newValue) => {
                                this.setState({selectValue:{id:props.id,value:newValue}})
                            }}
                            renderInput={
                                params => (<TextField {...params} label="Tienda" variant="outlined" fullWidth />)
                            }
                        />
                    )
                },
                { title: 'Num. Bodega (DB)', field: 'id', type: 'numeric' ,editable: 'never'},
                { title: 'Nombre de la bodega', field: 'name'},
            ]
        }
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,//this.props.key_,
        }
    }

    componentDidMount() {
        let $params = {
            method  : "get",
            headers : this.headers
        }

        fetch(this.methods.select,$params)
            .then(response => response.json())
            .then(result =>{
                let obj = result.map((item,i) => {
                    return {id:item.id,name:item.number+" - "+item.name,value:item.name}
                });
                this.stores=obj;
            });
    }
    handleCloseSnack = () => {
        this.setState({openSnack:false});
    }
    handleOpenSnack = (msg) => {
        this.setState({msg:{
                msg     : msg.msg?msg.msg:"Loaded",
                typeMsg : msg.typeMsg?msg.typeMsg:"info"
            }
        });
        this.setState({openSnack:true});
    }

    show($query){
        this.query = $query;
        let $return;
        $return = new Promise((resolve, reject) => {
            let $url = this.methods.show;
            $url += "per_page="+this.query.pageSize+"&page="+(this.query.page+1);
            if(!String($query.search)==="")
                $url +="&q="+$query.search;

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

    add($newData){
        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify($newData)
        };
        //let $result = new Promise(resolve => resolve());
        //console.log(Object.keys($newData).length,this.state.selectValue);
        let $url = this.methods.add+'store_id='+this.state.selectValue.value.id;
        let $result = new Promise(resolve => {
            setTimeout(() => {
                if(String(this.state.selectValue.value.id)==="undefined"){
                    this.handleOpenSnack({msg:"Debe seleccionar la tienda correspondiente los datos no se almacenaron.", typeMsg: "warning"});
                    resolve();
                }else{
                    //console.log(this.state.selectValue);
                    fetch($url,$params)
                        .then(response => {
                            if(response.ok){
                                response.json().then(result => {
                                    this.handleOpenSnack({msg:"Nueva bodega creada con éxito", typeMsg: "success"});
                                })
                            }else{
                                this.handleOpenSnack({msg:"No fue posible almacenar los datos intentelo nuevamente.", typeMsg: "error"});
                            }
                            resolve();
                        })
                        .catch(error => {
                            console.log(error);
                            resolve();
                        });
                }
            }, 600);
        });

        return $result;
    }

    delete($oldData){
        let $return;
        $oldData['per_page']= this.query.totalCount;
        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify($oldData)
        };

        $return =  new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.delete+'warehouse_id='+$oldData.id;
                fetch($url,$params)
                    .then(response => {
                        if(response.ok){
                            response.json().then(result => {
                                console.log(result);
                            })
                            this.handleOpenSnack({msg:"La bodega se ha eliminado con éxito", typeMsg: "success"});
                        }else{
                            this.handleOpenSnack({msg:"Hubo un error al solicitar la petición", typeMsg: "error"});
                        }
                        resolve();
                    })
                    .catch(error => {
                        console.log(error);
                        resolve();
                    });
            }, 350);
        })

        return $return;
    }

    edit(newData,oldData){
        let $return;
        let $params = {};
        console.log(this.state.selectValue);
        if(String(this.state.selectValue.value.name)!==undefined){
            newData.store_id    = this.state.selectValue.value.id;
        }
        $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(newData)
        };
        //$return = new Promise(resolve => resolve());
        $return = new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.edit+"warehouse_id="+oldData.id+"&name="+newData.name+"&store_id="+newData.store.id;
                fetch($url,$params)
                    .then(response => {
                        if(response.ok){
                            response.json().then( result => {
                                this.setState({selectValue:{}});
                                this.handleOpenSnack({msg:"Información almacenada con éxito" , typeMsg: "success"});
                            })
                        }else{
                            this.handleOpenSnack({msg:"Hubo un error al almacenar la información", typeMsg: "error"});
                        }
                        resolve();
                    })
                    .catch(error => {
                        this.handleOpenSnack({msg:"Error de red", typeMsg: "warning"});
                        console.log(error);
                        resolve();
                    });
            }, 350);
        });
        return $return;
    }

    render(){
        return (
            <div>
                <MaterialTable
                    title={this.props.title}
                    columns={ this.state.columns }
                    data={ $query => this.show($query)}
                    localization={materialTableLocaleES}
                    editable={{
                        onRowAdd: newData => this.add(newData),
                        onRowUpdate: (newData, oldData) => this.edit(newData,oldData),
                        onRowDelete: oldData => this.delete(oldData)
                    }}
                    options={{
                        pageSize: 10,
                        debounceInterval: 500,
                    }}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSnack}
                    autoHideDuration={2000}
                    onClose={this.handleCloseSnack}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleCloseSnack}
                        variant={this.state.msg.typeMsg}
                        message={this.state.msg.msg}
                    />
                </Snackbar>
            </div>
        );
    }
}

//ReactDOM.render(<MaterialTableNewDemo />, document.querySelector('#Table'));
