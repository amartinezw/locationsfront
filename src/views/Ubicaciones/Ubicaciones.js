/*eslint-disable*/
import React, { Component } from "react";
// @material-ui/core components
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import Fetch from 'components/Fetch/Fetch.js';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, MenuItem, Fab, FormControlLabel,
} from '@material-ui/core';
import Blocks from "components/Blocks/Blocks.js";
import ItemsInBlock from "components/ItemsInBlock/ItemsInBlock.js";
import Typography from '@material-ui/core/Typography';
import { actions, connect } from 'store';

const styles = theme => ({
    button: {
      margin: theme.spacing(1),
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: theme.spacing(1),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    FormControlLabel: {
      marginLeft: theme.spacing(1),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    fab: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    input: {
      display: 'none',
    },
  });

const getUrlRacks = process.env.REACT_APP_API_LOCATION+'/warehouselocations/getracks?warehouse_id=1';
const getUrlBlocks = process.env.REACT_APP_API_LOCATION+'/warehouselocations/getblocks?warehouse_id=1&rack=1';


const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    "Accept": "application/json",
    "Content-type": "application/json; charset=UTF-8",
    "Authorization": process.env.REACT_APP_API_TOKEN,
  }
};

class Ubicaciones extends Component {

  state = {    
    department: 'TODOS',
    active: 0,
    product: '',
    sku: '',
    filters: [{ name: 'active', value: 0 }],
    filtersChanged: false,
  };

  componentDidMount() {

  }

  
  handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  handleSearch = () => {
    const filters = [];
    filters.push({ name: 'active', value: state.active });    
    if (state.product !== '') {
      filters.push({ name: 'name', value: state.product });
    }
    if (state.sku !== '') {
      filters.push({ name: 'sku', value: state.sku });
    }
    if (state.department !== 'TODOS') {
      filters.push({ name: 'department', value: this.state.department });
    }
    setState({ ...state, filters, filtersChanged: true });
    return tableRef.current && tableRef.current.onQueryChange();
  };

  
  Error = () => (<p className="error">Something went wrong :-(</p>);

  Success = () => (<p className="success">Fetch event succeeded!</p>);

  render() {
    const { classes } = this.props;
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
          value={this.state.department}
          onChange={this.handleChange('department')}
          helperText="Seleccione una categoria"
          margin="normal"
          variant="outlined"
        >        
        </TextField>
        <TextField
          id="outlined"
          label="Producto"
          value={this.state.product}
          onChange={this.handleChange('product')}
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined"
          label="SKU"
          value={this.state.sku}
          onChange={this.handleChange('sku')}
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
          value={this.state.active}
          onChange={this.handleChange('active')}
          margin="normal"
          variant="outlined"
        >

          <MenuItem key="1" value="0">
           Activo
          </MenuItem>
          <MenuItem key="2" value="1">
           Inactivo
          </MenuItem>
        </TextField>
        <Fab variant="extended" aria-label="delete" className={classes.fab} onClick={() => this.handleSearch()}>
          <SearchIcon className={classes.extendedIcon} />
         Buscar
        </Fab>
      </form>
      <GridContainer>
        <GridItem xs={12} sm={4} md={3} style={{maxHeight: 450, overflow: 'auto'}}>
            <Fetch url={getUrlRacks} fetchOptions={FETCH_OPTIONS} fetchOnMount>
                {
                  ({ loading, error, data }) => {
                    if (error) {
                      return <p className="error">API no responde...</p>
                    }

                    if (loading) {
                      return <p className="success">Cargando...</p>
                    }

                    if (data) {
                      return (
                        <div className="items" style={{margin: 10}}>
                          {
                            data.map(
                              item => (
                                <GridItem key={item.rack} xs={12} sm={12} md={12}> 
                                  <Badge color="secondary" style={{width: "100%"}} max={999} badgeContent={item.total_items}>                                  
                                    <Button fullWidth={true} variant="contained" className={classes.button} onClick={() => actions.getBlocks(item.rack)}>
                                      {'RACK '+item.rack}
                                    </Button>
                                  </Badge>
                                </GridItem>
                              )
                            )
                          }
                        </div>
                      );
                    }

                    return <p className="text-align-center">Esperando respuesta...</p>
                  }
                }
              </Fetch>
        </GridItem>
        <GridItem xs={12} sm={8} md={9}>
          <GridContainer style={{maxHeight: 450, overflow: 'auto', padding: 10}}>
            <Blocks />
          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <ItemsInBlock />
        </GridItem>    
      </GridContainer>
    </Card>
    );  
  }
}
export default withStyles(styles)(Ubicaciones);
