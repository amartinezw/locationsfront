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
import RemoteTable from "components/RemoteTable/RemoteTable.jsx";

const useStyles = makeStyles(styles);

export default function Bodegas() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
            <RemoteTable title="Lista de tiendas" urlfetch="http://ec2-34-219-142-13.us-west-2.compute.amazonaws.com/api/v1/warehouselocations/getall?warehouse_id=1" 
              columns='[{ "title": "id", "field": "id" },{ "title": "Tienda", "field": "warehouse.store.name" }, { "title": "Bodega", "field": "warehouse.name" }, { "title": "Rack", "field": "rack"},{ "title": "Bloque", "field": "block" }, { "title": "Nivel", "field": "level" }, { "title": "Cadena de ubicacion", "field": "mapped_string" }]' />
        </Card>
      </GridItem>
    </GridContainer>
  );
}
