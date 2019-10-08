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
import Typography from '@material-ui/core/Typography';
import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import RemoteTable from "components/RemoteTable/RemoteTable.jsx";
import { actions, connect } from 'store';

const useStyles = makeStyles(styles);

export default function Inventario() {
  const inventarioColumns = [
    { "title": "Producto", "field": "product" },
    { "title": "Sku", "field": "sku" }, 
    { "title": "Talla", "field": "variation" },
    { "title": "Departamento", "field": "department" }, 
    { "title": "Stock", "field": "stock"},
  ];
  
  let renderTables = () => {
    return console.log(actions.getInventory())
  }

  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>          
          {renderTables()}           
        </Card>
      </GridItem>
    </GridContainer>
  );
}
