/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LocatedInventory from "components/ItemsInBlock/LocatedInventory.js";
import {Typography, TextField, MenuItem, Fab} from '@material-ui/core';
import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import MaterialTable from 'material-table'
import { actions, connect } from 'store';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  fab: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
}));


export default function Inventario() {
  actions.getInventory();
  const classes = useStyles();
  return (
        <Card>          
          <form className={classes.container} noValidate autoComplete="off">               
               <TextField
                 id="outlined-select-currency"
                 select
                 label="Categoria"
                 className={classes.textField}                                  
                 SelectProps={{
                   MenuProps: {
                     className: classes.menu,
                   },
                 }}
                 value="1"
                 helperText="Seleccione una categoria"
                 margin="normal"
                 variant="outlined"
               >           

                 <MenuItem key="1" value="1">
                   Hombres
                 </MenuItem>
                 <MenuItem key="1" value="1">                   
                 DAMAS  COLLEGE
                 </MenuItem>
                 <MenuItem key="1" value="1">
                 DAMAS  URBAN                   
                 </MenuItem>
                <MenuItem key="1" value="1">                   
                 DAMAS
                 </MenuItem>
                 <MenuItem key="1" value="1">                   
                  DAMAS
                 </MenuItem>
                 <MenuItem key="1" value="1">                   
                  CABALLEROS
                 </MenuItem>
                 <MenuItem key="1" value="1">                   
                 DAMAS JR                  
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                 ZAPATERIA CABALLEROS
                 </MenuItem>                 
                 <MenuItem key="1" value="1">                                   
                 ZAPATERIA DAMAS
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                  DAMAS CCP
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                  CABALLEROS CCP
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                  BEBES
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                 CABALLEROS  COLLEGE
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                 CABALLEROS  URBAN
                 </MenuItem>
                 <MenuItem key="1" value="1">                                     
                 INTERIOR CABALLEROS CITY&CO
                 </MenuItem>                 
                 <MenuItem key="1" value="1">                                     
                 INTERIOR CABALLEROS CCP                 
                 </MenuItem>
               </TextField>
               <TextField                 
                 id="outlined"
                 label="Producto"
                 defaultValue=""
                 className={classes.textField}
                 margin="normal"
                 variant="outlined"
               />
               <TextField                 
                 id="outlined"
                 label="SKU"
                 defaultValue=""
                 className={classes.textField}
                 margin="normal"
                 variant="outlined"
               />
               <TextField
                 id="outlined-select-currency"
                 select
                 label="Status"
                 className={classes.textField}                                  
                 SelectProps={{
                   MenuProps: {
                     className: classes.menu,
                   },
                 }}
                 value="1"                 
                 margin="normal"
                 variant="outlined"
               >           

                 <MenuItem key="1" value="1">
                   Activo
                 </MenuItem>
                 <MenuItem key="2" value="0">
                   Inactivo
                 </MenuItem>                 
               </TextField>
               <Fab variant="extended" aria-label="delete" className={classes.fab}>
                 <SearchIcon className={classes.extendedIcon} />
                 Buscar
               </Fab>
          </form>
          <LocatedInventory />
        </Card>
    
  );
}
