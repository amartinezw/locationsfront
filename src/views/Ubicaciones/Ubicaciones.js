/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import Fetch from 'components/Fetch/Fetch.js';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, MenuItem, Fab, FormControlLabel,
} from '@material-ui/core';
import Blocks from "components/Blocks/Blocks.js";
import ItemsInBlock from "components/ItemsInBlock/ItemsInBlock.js";
import Typography from '@material-ui/core/Typography';
import { actions, connect } from 'store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

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

export default function Ubicaciones() {

  const [state, setState] = React.useState({    
    department: 'TODOS',
    active: 0,
    product: '',
    sku: '',
    filters: [{ name: 'active', value: 0 }],
    filtersChanged: false,
  });

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
  };

  const handleSearch = () => {
    const filters = [];
    filters.push({ name: 'active', value: state.active });    
    if (state.product !== '') {
      filters.push({ name: 'name', value: state.product });
    }
    if (state.sku !== '') {
      filters.push({ name: 'sku', value: state.sku });
    }
    if (state.department !== 'TODOS') {
      filters.push({ name: 'department', value: state.department });
    }
    setState({ ...state, filters, filtersChanged: true });
    return tableRef.current && tableRef.current.onQueryChange();
  };

  const classes = useStyles();
  const Error = () => (<p className="error">Something went wrong :-(</p>);

  const Success = () => (<p className="success">Fetch event succeeded!</p>);

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
        value={state.department}
        onChange={handleChange('department')}
        helperText="Seleccione una categoria"
        margin="normal"
        variant="outlined"
      >
        <MenuItem key="0" value="TODOS">
        TODOS
        </MenuItem>
        <MenuItem key="1" value="DAMAS">
        Hombre
        </MenuItem>
        <MenuItem key="2" value="CABALLEROS">
        Kids
        </MenuItem>
        <MenuItem key="3" value="DAMAS  COLLEGE">
        Kids niña
        </MenuItem>
        <MenuItem key="4" value="DAMAS  URBAN">
        Kids niño
        </MenuItem>
        <MenuItem key="5" value="DAMAS JR">
        Lencería
        </MenuItem>
        <MenuItem key="6" value="ZAPATERIA CABALLEROS">
        Lencería y pijamas
        </MenuItem>
        <MenuItem key="7" value="ZAPATERIA DAMAS">
        Mujer
        </MenuItem>
      </TextField>
      <TextField
        id="outlined"
        label="Producto"
        value={state.product}
        onChange={handleChange('product')}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
      <TextField
        id="outlined"
        label="SKU"
        value={state.sku}
        onChange={handleChange('sku')}
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
        value={state.active}
        onChange={handleChange('active')}
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
      <Fab variant="extended" aria-label="delete" className={classes.fab} onClick={() => handleSearch()}>
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
                      <div className="items">
                        {
                          data.map(
                            item => (
                              <GridItem key={item.rack} xs={12} sm={12} md={12}> 
                                <Button fullWidth={true} variant="contained" className={classes.button} onClick={() => actions.getBlocks(item.rack)}>
                                  {'RACK '+item.rack}
                                </Button>
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
