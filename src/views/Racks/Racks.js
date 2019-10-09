/*eslint-disable*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import RemoteTableLocations from "components/RemoteTableLocations/RemoteTableLocations.jsx";

const useStyles = makeStyles(styles);

export default function Racks() {
    const classes = useStyles();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card plain>
                    <RemoteTableLocations title="Contenido de los anaqueles" />
                </Card>
            </GridItem>
        </GridContainer>
    );
}