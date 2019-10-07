/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import RemoteTableUser from "components/RemoteTable/RemoteTableUser.js";
import Button from '@material-ui/core/Button';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring';
import TextField from "@material-ui/core/TextField/TextField";
import SnackbarContent from "@material-ui/core/SnackbarContent/SnackbarContent";
import Grid from "@material-ui/core/Grid/Grid";
import Link from "@material-ui/core/Link/Link";
import userService from "../../services/user.service";
import history from "../../history";


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
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password, returnUrl } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }

        this.setState({ loading: true });
        userService.login(username, password)
            .then(
                resutl => {
                    if (resutl.status === 'success') {
                        const  from  = { from: { pathname: "/admin/dashboard" } };
                        history.push("/admin/dashboard");
                        window.location.reload();
                    }

                },

                error => this.setState({ error})
            );
    }


    const usuarios = [
        { "title": "id", "field": "id" },
        { "title": "Nombre", "field": "name" },
        { "title": "Email", "field": "email" },
        { "title": "Direccion", "field": "address"},
        { "title": "Creación", "field": "created_at" }
    ];

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
    const form = {
        width: '100%', // Fix IE 11 issue.
        marginTop: "10px",
    };
    const submit = {
        margin: "0px",
        marginTop:"5px",
        marginBottom:"10px",
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
                            <form style={form} onSubmit={handleSubmit}>
                                <TextField
                                    required
                                    variant="outlined"
                                    margin="normal"
                                    type="email"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="username"
                                    autoComplete="email"
                                    //onChange={this.handleChange}
                                    autoFocus
                                />
                                <TextField
                                    required
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    //onChange={this.handleChange}
                                    autoComplete="current-password"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    style={submit}
                                >
                                    Guardar
                                </Button>
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
