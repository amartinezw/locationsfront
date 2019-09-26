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
  const bodegasColumns = [
    { "title": "id", "field": "id" },
    { "title": "Tienda", "field": "warehouse.store.name" }, 
    { "title": "Bodega", "field": "warehouse.name" }, 
    { "title": "Rack", "field": "rack"},
    { "title": "Bloque", "field": "block" }, 
    { "title": "Nivel", "field": "level" }, 
    { "title": "Cadena de ubicacion", "field": "mapped_string" }
  ];
  
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
            <RemoteTable title="Lista de tiendas" urlfetch={process.env.REACT_APP_API_LOCATION+"/warehouselocations/getall?warehouse_id=1"} 
              columns={bodegasColumns} />
        </Card>
      </GridItem>
    </GridContainer>
  );
}
