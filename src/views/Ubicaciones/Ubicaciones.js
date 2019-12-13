/*eslint-disable*/
import React, { Component } from "react";
// @material-ui/core components
import { makeStyles, createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import SearchIcon from '@material-ui/icons/Search';
import {
    TextField, MenuItem, Fab, FormControlLabel, Checkbox,
} from '@material-ui/core';
import Blocks from "components/Blocks/Blocks.js";
import ItemsInBlock from "components/ItemsInBlock/ItemsInBlock.js";
import { actions, connect } from 'store';
import * as overlay from '../../components/loader';

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
        marginTop: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
});

class Ubicaciones extends Component {
    constructor (props){
        super(props);
        this.serverApi = process.env.REACT_APP_API_LOCATION;
        this.methods = {
            getCategories       : this.serverApi+'/categories/parent',
            getSubCategories    : this.serverApi+'/categories/child/'
        };
        this.query = "";
        this.state = {
            withZeros: false,
            selected: [],
            active: -1,
            product: '',
            sku: '',
            filters: [{ name: 'active', value: 0 }],
            filtersChanged: false,
            categories:[],
            subCategories:[],
            category:'0',
            subCategory:'0',
            getUrlBlocks: this.serverApi+'/warehouselocations/getblocks?warehouse_id=1',
            getUrlRacks: this.serverApi+'/warehouselocations/getracks?warehouse_id=1',
            racks: [],
        };
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+localStorage.getItem('token'),
        };
        this.params = {
            method  : "get",
            headers : this.headers
        }
    }

    componentDidMount() {
        const { classes } = this.props;
        let categories = [];
        let $url = this.methods.getCategories;
        fetch($url,this.params)
            .then(response => {
                return response.json();
            }).then(result => {
            categories = result;
            let objectRol = {};
            categories.map((item, key) =>
                objectRol[item.id] = item.name,
            );
            this.setState({
                categories : categories,
                subCategory: 0,
            });
        });
        this.fetchRacks(this.state.getUrlRacks, this.params);
    }
    handleChangeCheckBox = (name) => (event) => {
      this.setState({[name]: event.target.checked });      
      actions.setWithZeros(event.target.checked);

    };

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value })
    };

    handleChangeCategory = (name) => (event) => {
        this.setState({[name]: event.target.value });
        this.setState({subCategory : 0 });
        this.getSubcategory(event.target.value);
    };

    getSubcategory = (category) => {
        let subC = [];
        if (category > 0) {
            let $url = this.methods.getSubCategories+''+category;
            fetch($url,this.params)
                .then(response => {
                    return response.json();
                }).then(result => {
                subC = result;
                let objectRol = {};
                subC.map((item, key) =>
                    objectRol[item.id] = item.name,
                );
                this.setState({
                    subCategories : subC,
                });
            });
        } else {
            this.setState({
                subCategories : subC,
            });
        }



    };

    handleSearch = () => {
        const filters = [];
        let urlFilters = '';
        if (this.state.withZeros === true) {
          filters.push({ name: 'withzeros', value: this.state.withZeros });
        }
        if (this.state.active !== -1) {
          filters.push({ name: 'active', value: this.state.active });

        }
        if (this.state.product !== '') {
          filters.push({ name: 'product', value: this.state.product });  
        }
        if (this.state.sku !== '') {
          filters.push({ name: 'sku', value: this.state.sku });  
        }
        if (this.state.category !== '0') {
          filters.push({ name: 'category', value: this.state.category });  
        }
        if (this.state.subcategory !== '0') {
          filters.push({ name: 'subcategory', value: this.state.subCategory });  
        }
        
        filters.map((filter) => {
          urlFilters += `&${filter.name}=${filter.value}`;
          return true;
        });

        let getUrlRacks = this.serverApi+'/warehouselocations/getracks?warehouse_id=1'+urlFilters;
        let getUrlBlocks = this.serverApi+'/warehouselocations/getblocks?warehouse_id=1'+urlFilters;
        this.fetchRacks(getUrlRacks, this.params);
        this.setState({ getUrlBlocks: getUrlBlocks });
    };

    fetchRacks = (getUrlRacks, params)  => {
        fetch(getUrlRacks, params)
            .then(results => {
                return results.json();
            }).then(data => {
            this.setState({racks:data});
        });
    };

    Error = () => (<p className="error">Something went wrong :-(</p>);

    Success = () => (<p className="success">Fetch event succeeded!</p>);

    render() {
        const { classes } = this.props;
        const renderRacks = (racks: Array<Object>) => {
            const { classes } = this.props;
            return racks.map((item) => {
                return (
                    <div key={item.rack} className="items" style={{margin: 10}}>
                        <GridItem  xs={12} sm={12} md={12}>
                            <Badge color="secondary" style={{width: "100%"}} max={999}
                                   badgeContent={item.total_items}>
                                <Button fullWidth={true} size="small" color={this.state.selected[item.id]?"primary":"default"} variant="contained" className={classes.button} disabled={item.total_items > 0 ? false : true}
                                        onClick={(e) => {
                                            this.state.selected = this.state.selected.map((i,data)=>{
                                                return false;
                                            });
                                            overlay.showLoader();
                                            this.state.selected[item.id]=true;
                                            this.setState({selected:this.state.selected});
                                            actions.getBlocks(item.rack, this.state.getUrlBlocks);
                                        }
                                        }>
                                    {'RACK ' + item.rack}
                                </Button>
                            </Badge>
                        </GridItem>
                    </div>
                )
            })
        };
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
                            },
                        }}
                        value={this.state.category}
                        onChange={this.handleChangeCategory('category')}
                        helperText="Seleccione una categoria"
                        margin="dense"
                        variant="outlined"
                    >
                        <MenuItem key="" value="0">
                            Todos
                        </MenuItem>
                        {this.state.categories.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Subcategoría"
                        className={classes.textField}
                        SelectProps={{
                            MenuProps: {
                            },
                        }}
                        value={this.state.subCategory}
                        onChange={this.handleChange('subCategory')}
                        helperText="Seleccione una subcategoria"
                        margin="dense"
                        variant="outlined"
                    >
                        <MenuItem key="" value="0">
                            Todos
                        </MenuItem>
                        {this.state.subCategories.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="outlined"
                        label="Producto"
                        value={this.state.product}
                        onChange={this.handleChange('product')}
                        className={classes.textField}
                        margin="dense"
                        variant="outlined"
                    />
                    <TextField
                        id="outlined"
                        label="SKU/Estilo"
                        value={this.state.sku}
                        onChange={this.handleChange('sku')}
                        className={classes.textField}
                        margin="dense"
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
                        margin="dense"
                        variant="outlined"
                    >
                        <MenuItem key="1" value="-1">
                            Selecciona
                        </MenuItem>
                        <MenuItem key="2" value="0">
                            Activo
                        </MenuItem>
                        <MenuItem key="3" value="1">
                            Inactivo
                        </MenuItem>
                    </TextField>
                    <Fab variant="extended" size="small" aria-label="delete" className={classes.fab} onClick={() => this.handleSearch()}>
                        <SearchIcon className={classes.extendedIcon} />
                        Buscar
                    </Fab>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={this.state.withZeros}
                          onChange={this.handleChangeCheckBox('withZeros')}
                          value="withZeros"
                          color="primary"
                        />
                      )}
                      className={classes.FormControlLabel}
                      label="Productos sin stock"
                    />
                </form>
                <GridContainer>
                    <GridItem xs={12} sm={4} md={3} style={{maxHeight: '50vh', overflow: 'auto'}}>
                        {renderRacks(this.state.racks)}
                    </GridItem>
                    <GridItem xs={12} sm={8} md={9}>
                        <GridContainer style={{maxHeight: '50vh', overflow: 'auto', padding: 10}}>
                            <Blocks />
                        </GridContainer>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <ItemsInBlock withZeros={this.state.withZeros}/>
                    </GridItem>
                </GridContainer>
            </Card>
        );
    }
}
export default withStyles(styles)(Ubicaciones);
