/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import * as Sentry from '@sentry/browser';
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'store'
import  PrivateRoutes  from "components/PrivateRoutes.js";
import history from 'history.js';

// core components
import Admin from "layouts/Admin.js";
import Login from "views/Login/Login.js";
import RTL from "layouts/RTL.js";

import "assets/css/material-dashboard-react.css?v=1.8.0";

Sentry.init({dsn: "https://5c2335fc39bc4bda9eec0cd4f890ac81@sentry.io/1732073"});

ReactDOM.render(
<Provider>
    <Router history={history}>
        <div>
            <PrivateRoutes exact path="/admin/dashboard" component={Admin} />
            <PrivateRoutes exact path="/admin/bodegas" component={Admin} />
            <PrivateRoutes exact path="/admin/ubicaciones" component={Admin} />
            <PrivateRoutes exact path="/admin/usuarios" component={Admin} />
            <PrivateRoutes exact path="/logout" component={Admin} />
            <Route path="/login" component={Login} />
        </div>
    </Router>
</Provider>,
  document.getElementById("root")
);
