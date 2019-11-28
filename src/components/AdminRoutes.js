import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AdminRoutes = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('token')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export default AdminRoutes;