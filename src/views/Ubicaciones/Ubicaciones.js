/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Fetch from 'components/Fetch/Fetch.js';
import Button from '@material-ui/core/Button';
import Blocks from "components/Blocks/Blocks.js";
import ItemsInBlock from "components/ItemsInBlock/ItemsInBlock.js";
import { actions, connect } from 'store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
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
  const classes = useStyles();
  const Error = () => (<p className="error">Something went wrong :-(</p>);

  const Success = () => (<p className="success">Fetch event succeeded!</p>);

  return (
  <Card>
    <GridContainer>
      <GridItem xs={12} sm={4} md={3}>
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
                          data.data.map(
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
        <GridContainer>
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
