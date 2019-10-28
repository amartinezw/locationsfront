import React from 'react';

// @material-ui/core
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
// @material-ui/icons
import Store from '@material-ui/icons/Store';
import DateRange from '@material-ui/icons/DateRange';
import LocalOffer from '@material-ui/icons/LocalOffer';
import { NavLink } from "react-router-dom";

// core components
import GridItem from 'components/Grid/GridItem';
import GridContainer from 'components/Grid/GridContainer';

import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardIcon from 'components/Card/CardIcon';

import CardFooter from 'components/Card/CardFooter';
import RemoteTable from '../../components/RemoteTable/RemoteTable';

import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';


const ultimosColumns = [
    { title: 'Estilo', field: 'internal_reference' },
    { title: 'Proveedor', field: 'provider' },
    { title: 'Producto', field: 'name' },
    { title: 'Color', field: 'colors_es' },
    {
      title: 'Fecha',
      field: 'updated_at',
      render: (rowData) => rowData.variations[0].locations[0].updated_at,
    },
    {
      title: 'Ubicacion',
      field: 'mapped_string',
      render: (rowData) => {
        if (rowData.locations) {
          return rowData.locations.map((location) => (
            <React.Fragment key={location.id}>
              {location.warehouselocation.mapped_string}
              <br />
            </React.Fragment>
          ));
        }
        return '';
      },
    },
  ];

class Dashboard extends React.Component {

  state = {
    productsLocatedCount: '1',
    warehousesCount: '',
    storesCount: '',
    warehouseLocationsCount: '',
  };

  componentDidMount() {
    this.fetchData();
  }

  downloadSticker = () => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: process.env.REACT_APP_API_TOKEN,
      },
    }
    const url = process.env.REACT_APP_API_LOCATION + '/locationvariation/printsticker';
    fetch(url, fetchOptions)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'sticker.pdf';
          a.click();
        });

    });
  }

  fetchData = async () => {
    const url = process.env.REACT_APP_API_LOCATION + '/locationvariation/getsummary?warehouse_id=1';
    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: process.env.REACT_APP_API_TOKEN,
      },
    };
    try {
      const data = await (await fetch(url, fetchOptions)).json();
      this.setState({
        productsLocatedCount: data.productsLocatedCount,
        warehousesCount: data.warehousesCount,
        storesCount: data.storesCount,
        warehouseLocationsCount: data.warehouseLocationsCount,
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <NavLink
              to="/admin/altabodegas"
              activeClassName="active"
              key={1}
            >
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>business</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Bodegas</p>
                  <h3 className={classes.cardTitle}>
                    {this.state.warehousesCount}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Icon>business</Icon>
                      Total de bodegas
                  </div>
                </CardFooter>
              </Card>
            </NavLink>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Tiendas</p>
                <h3 className={classes.cardTitle}>{this.state.storesCount}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <DateRange />
                  Total de tiendas
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <NavLink
              to="/admin/ubicaciones"
              activeClassName="active"
              key={2}
            >
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>info_outline</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Ubicaciones</p>
                  <h3 className={classes.cardTitle}>{this.state.warehouseLocationsCount}</h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <LocalOffer />
                    Mapeo y consulta
                  </div>
                </CardFooter>
              </Card>
            </NavLink>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <NavLink
              to="/admin/inventario"
              activeClassName="active"
              key={3}
            >
              <Card>
                <CardHeader color="primary" stats icon>
                  <CardIcon color="primary">
                    <Icon>assessment</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Productos ubicados</p>
                  <h3 className={classes.cardTitle}>
                    {this.state.productsLocatedCount}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <Icon>assessment</Icon>
                      Total de productos ubicados
                  </div>
                </CardFooter>
              </Card>
            </NavLink>
          </GridItem>
          <Card plain>
            <RemoteTable
              title="Ultimos productos ubicados"
              urlfetch={`${process.env.REACT_APP_API_LOCATION}/locationvariation/getlatest?warehouse_id=1`}
              columns={ultimosColumns}
            />
          </Card>
        </GridContainer>
        <Card>
          <Button
            variant="contained"
            className="button"
            onClick={
              () => this.downloadSticker()
            }
          >
            Descargar
          </Button>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
