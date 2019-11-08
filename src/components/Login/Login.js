import React from 'react';
import userService from '../../services/user.service.js';
import history from '../../history.js';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PinDrop from '@material-ui/icons/PinDrop';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import SnackbarContent from '@material-ui/core/SnackbarContent';


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Almacenes Garcia
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;

        // stop here if form is invalid
        if (!(username && password)) {
            return;
        }

        this.setState({ loading: true });
        userService.login(username, password)
            .then(
                resutl => {
                    if (resutl.status === 'success') {                        
                        history.push("/admin/dashboard");
                         window.location.reload();
                    }

                },

                error => this.setState({ error})
            );
    }

    render() {
        const { error } = this.state;
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
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div style={paper}>
                    <Avatar style={avatar}>
                        <PinDrop />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Iniciar Sesión - CCP Ubicaciones
                    </Typography>
                    <form style={form} onSubmit={this.handleSubmit}>
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
                            onChange={this.handleChange}
                            autoFocus
                        />
                        <TextField
                            required
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={this.handleChange}
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={submit}
                        >
                            Entrar
                        </Button>
                        {error &&
                        <div>
                            <SnackbarContent
                                message={error}
                                style={snackbarWarning}
                            />
                        </div>
                        }
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}
export default LoginPage;