/*eslint-disable*/
import React from "react";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import RemoteTableStores from "components/RemoteTableStores/RemoteTableStores.jsx";

//const useStyles = makeStyles(styles);

export default function Warehouse() {
    //const classes = useStyles();
    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card plain>
                    <RemoteTableStores title="Modificación de bodegas" />
                </Card>
            </GridItem>
        </GridContainer>
    );
}