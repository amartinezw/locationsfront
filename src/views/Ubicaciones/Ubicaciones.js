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
import Grid from "@material-ui/core/Grid/Grid";

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
            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
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

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value })
    };

    handleChangeCategory = (name) => (event) => {
        this.setState({[name]: event.target.value });
        this.setState({subCategory : 0 });
        this.getSubcategory(event.target.value);
    };

    getSubcategory = (category) => {
        let $url = this.methods.getSubCategories+''+category;
        let subC = [];
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

    };

    handleSearch = () => {
        const filters = [];
        filters.push({ name: 'active', value: this.state.active });
        filters.push({ name: 'product', value: this.state.product });
        filters.push({ name: 'sku', value: this.state.sku });
        filters.push({ name: 'category', value: this.state.category });
        filters.push({ name: 'subcategory', value: this.state.subCategory });

        let getUrlRacks = this.serverApi+'/warehouselocations/getracks?warehouse_id=1&active='+filters[0].value+'&product='+filters[1].value+'&sku='+filters[2].value+'&category='+filters[3].value+'&subcategory='+filters[4].value;
        let getUrlBlocks = this.serverApi+'/warehouselocations/getblocks?warehouse_id=1&active='+filters[0].value+'&product='+filters[1].value+'&sku='+filters[2].value+'&category='+filters[3].value+'&subcategory='+filters[4].value;
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
                                <Button fullWidth={true} variant="contained" className={classes.button} disabled={item.total_items > 0 ? false : true}
                                        onClick={() => {                                          
                                          actions.getBlocks(item.rack, this.state.getUrlBlocks)}
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
                        margin="normal"
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
                        margin="normal"
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
                    <Fab variant="extended" aria-label="delete" className={classes.fab} onClick={() => this.handleSearch()}>
                        <SearchIcon className={classes.extendedIcon} />
                        Buscar
                    </Fab>
                </form>
                <GridContainer>
                    <GridItem xs={12} sm={4} md={3} style={{maxHeight: 450, overflow: 'auto'}}>
                        {renderRacks(this.state.racks)}
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
