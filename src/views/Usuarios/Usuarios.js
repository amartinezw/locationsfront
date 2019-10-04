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

const useStyles = makeStyles(styles);
export default function Usuarios() {
    const usuarios = [
        { "title": "id", "field": "id" },
        { "title": "Nombre", "field": "name" },
        { "title": "Email", "field": "email" },
        { "title": "Direccion", "field": "address"},
        { "title": "Creación", "field": "created_at" }
    ];

    const classes = useStyles();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card plain>
                    <RemoteTableUser title="Lista de usuarios" urlfetch={process.env.REACT_APP_API_LOCATION+"/user/getusers?"}
                                 columns={usuarios} />
                </Card>
            </GridItem>
        </GridContainer>

    );
}
