/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import RemoteTableUser from "components/RemoteTable/RemoteTableUser.js";
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import InputAdornment from '@material-ui/core/InputAdornment';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CopyToClipboard from "react-copy-to-clipboard";
import userService from "../../services/user.service";
import history from "../../history";
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";

//Estilos
const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: 900,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

// Fade del modal
const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });
    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

export default function Usuarios() {

    // Variables constanters
     const [state, setState] = React.useState({
        name : '',
        email : '',
        address: '',
        password: '',
        error: '',
     });
    const [open, setOpen] = React.useState(false);

    // Genera el password aleatorio
    const generatePws = () => {
        var pass = require("randomstring");
        setState({ ...state, password: pass.generate(7) });
    };

    //Cacha los valores de los input y se los asigna a las constantes
    const handleNameChange = e => {
        setState({...state, name: e.target.value })
    };
    const handleEmailChange = e => {
        setState({...state, email: e.target.value});
    };
    const handleAddressChange = e => {
        setState({...state, address: e.target.value});
    };

    //Abre y cierra el modal setando status a constantes
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // Envia formulario a user.services
    const handleSubmit = e => {
        e.preventDefault();

        const { name, email, address, password } = state;

        // stop here if form is invalid
        if (!(name && password && address && email)) {
            return;
        }

        userService.addUser(name, email, password, address)
            .then(
                resutl => {
                    if (resutl.status === "success") {
                        const  from  = { from: { pathname: "/admin/usuarios" } };
                        history.push(from);
                        window.location.reload();
                    }
                },

                error => setState({ ...state, error: error})
            );
    };

    // Declara cabeceras a las tablas
    const usuarios = [
        { "title": "id", "field": "id" },
        { "title": "Nombre", "field": "name" },
        { "title": "Email", "field": "email" },
        { "title": "Direccion", "field": "address"},
        { "title": "Creación", "field": "created_at" }
    ];

    // Instancia los estilos
    const classes = useStyles();
    const paper = {
        marginTop: "8px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };
    const avatar = {
        margin: "1em",
        backgroundColor: "white",
        color: "red",
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
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleOpen}
                >
                    Agregar usuario
                </Button>
                <Modal
                    aria-labelledby="spring-modal-title"
                    aria-describedby="spring-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            {state.error &&
                            <div>
                                <SnackbarContent
                                    message={state.error}
                                    style={snackbarWarning}
                                />
                            </div>
                            }
                            <form className={classes.container} onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <h3>
                                            Registrar nuevo usuario
                                        </h3>
                                    </Grid>
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
                                            onChange={handleNameChange}
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
                                            onChange={handleEmailChange}
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
                                            onChange={handleAddressChange}
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
                                            value={state.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CopyToClipboard text={state.password}>
                                                            <Button
                                                                margin="normal"
                                                                color="primary"
                                                            >
                                                                <FileCopyIcon>
                                                                </FileCopyIcon>
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
                                            onClick={generatePws}
                                        >
                                            Generar
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            style={submit}
                                        >
                                            Guardar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Fade>
                </Modal>
                <Card plain>
                    <RemoteTableUser title="Lista de usuarios" />
                </Card>
            </GridItem>
        </GridContainer>


    );
}
