import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import RemoteTableUser from "components/RemoteTable/RemoteTableUser.js";

export default function Usuarios() {

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card plain>
                    <RemoteTableUser title="Lista de usuarios" />
                </Card>
            </GridItem>
        </GridContainer>
    );
}
