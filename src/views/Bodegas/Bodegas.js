/*eslint-disable*/
import React, {useState , useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components

import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import RemoteTable from "components/RemoteTable/RemoteTable.jsx";

import CustomInput from "components/CustomInput/CustomInput.js";
//import Icon from "@material-ui/core/Icon";
import CardBody from "components/Card/CardBody";
import Button from "components/CustomButtons/Button.js";
import Grid from "@material-ui/core/Grid";
import {
    CardHeader,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Modal,
    Row,
    Col
} from "reactstrap";

import NumericInput from 'react-numeric-input';
import Label from "reactstrap/es/Label";

const styles = {
    positionFlow: {

    },
    textRight: {
        textAlign: "right"
    }
};

const useStyles = makeStyles(styles);

export default function Bodegas() {
    const classes = useStyles();
    /*
    const state = {
        exampleModal: false
    };*/
    const [state,setState] = useState(false);
    /*const toggleModal = state => {
        this.setState({
            [state]: !state[state]
        });

    };*/
    //const [open,setState] = useState(open);
    const [hasError, setErrors] = useState(false);
    const [planets, setPlanets] = useState({});

    async function fetchData() {
        const key ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFiNjM2MWE2MDkzYjRiNzMwZWYxMTY1YzIxODA1ZmYxYWFjNWZhN2JlMjRlMzliZGQ2Yjk2NTA1OTcxZDZjMDgxNjE3Y2Y2YzBlYjUwMWRhIn0.eyJhdWQiOiIxIiwianRpIjoiMWI2MzYxYTYwOTNiNGI3MzBlZjExNjVjMjE4MDVmZjFhYWM1ZmE3YmUyNGUzOWJkZDZiOTY1MDU5NzFkNmMwODE2MTdjZjZjMGViNTAxZGEiLCJpYXQiOjE1NjgwNTAwMDEsIm5iZiI6MTU2ODA1MDAwMSwiZXhwIjoxNTk5NjcyNDAxLCJzdWIiOiIiLCJzY29wZXMiOltdfQ.I-zsnSQ7kvBgwYos9vcvsjsZoRubdhtyxLlSGXhIfO5FVD0qBf2OuxpTrTFaCzZuSt0xaZjBNbRxKC8YfZou4wY0HTFsquz7nfRTBSnyG1O1oI1RkJq3H9MHNdZSASyxd90SzD-hUN_erkQGV2Zx3QJcwBWbBrVrtuxP-VpeeHh2g3X9PnG5GnR5i7mkhFbPSVI6gYQvgbRvXcEMCGHt2ifKYC3cAr43cHUrNDQphYEesD9AxRgdruikVBQ3ZKFSi1Ax80Kr-iPrgaOIQMc17mQZK18x3jfsNNpFgQMWzcaUvJdF60G-DemLQHmnj3CEjSQt42vtwupHMsABGji_HFC0u26F1yuh2FcX1iVQ59UJ2bajYiWuudJt8PawVv0E2OZlb2AWJHa2Hpmt6ZX_TBYMRbuIWdRAU0UOUC5vbsf6tl4dwjAwig36LllWDNGaGZozK4DCyepOHpml35vBn1C9ju5KBKmZygGcULgPN7ehuxMCos8vRleHGx2qaXAZUiwPT55DLI_XjTqQe1R-qxDxqAWws6at0CnM4hiMj5VEl9ptvhzYpVJbd9ytlMV4rVS3woFdAz4APFopHx-nGtno5bbJCheL0NwkLD9JldR--MuZscx2NRhvdiqAkinryqQo3eaBqblTLT9J8z_U4kwwph-X5r_4dNngy1SlUYQ";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+key
        }
        const params = {
            method: "GET",
            headers: headers
        }
        const res = await fetch("http://ec2-34-219-142-13.us-west-2.compute.amazonaws.com/api/v1/warehouses/getall?store_id=1",params);
        res
            .json()
            .then(res => {
                res = res.results.map((planet) => {
                    return planet
                });
                setPlanets(res);
            })
            .catch(err => setErrors(err));
    }

    useEffect(() => {
        fetchData();
    },[]);

  return (
    <Grid container>
        <Modal
            className="modal-dialog-centered modal-lg"
            isOpen={state}
            toggle={() => setState(!state)}
        >
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                    Agregar nueva localización
                </h5>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setState(!state)}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <Form>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12" >
                            <FormGroup>
                                <Label for="bodega">Bodega</Label>
                                {JSON.stringify(planets)}
                            </FormGroup>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12" >
                            <FormGroup>
                                <Label for="bloque">Bloques</Label>
                                <Input type="select" name="bloque" id="bloque">
                                    <option value="1" >1</option>
                                    <option value="2" >2</option>
                                    <option value="3" >3</option>
                                    <option value="4" >4</option>
                                    <option value="5" >5</option>
                                    <option value="6" >6</option>
                                    <option value="7" >7</option>
                                    <option value="8" >8</option>
                                    <option value="9" >9</option>
                                    <option value="10" >10</option>
                                    <option value="11" >11</option>
                                    <option value="12" >12</option>
                                    <option value="13" >13</option>
                                    <option value="14" >14</option>
                                    <option value="15" >15</option>
                                    <option value="16" >16</option>
                                    <option value="17" >17</option>
                                    <option value="18" >18</option>
                                    <option value="19" >19</option>
                                    <option value="20" >20</option>
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12" >
                            <FormGroup>
                                <Label for="nivel">Niveles</Label>
                                <Input type="select" name="nivel" id="nivel">
                                    <option value="1" >1</option>
                                    <option value="2" >2</option>
                                    <option value="3" >3</option>
                                    <option value="4" >4</option>
                                    <option value="5" >5</option>
                                    <option value="6" >6</option>
                                    <option value="7" >7</option>
                                    <option value="8" >8</option>
                                    <option value="9" >9</option>
                                    <option value="10" >10</option>
                                    <option value="11" >11</option>
                                    <option value="12" >12</option>
                                    <option value="13" >13</option>
                                    <option value="14" >14</option>
                                    <option value="15" >15</option>
                                    <option value="16" >16</option>
                                    <option value="17" >17</option>
                                    <option value="18" >18</option>
                                    <option value="19" >19</option>
                                    <option value="20" >20</option>
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12" >
                            <FormGroup>
                                <Label for="lados">Lados</Label>
                                <Input type="select" name="lados" id="lados">
                                    <option value="1" >1</option>
                                    <option value="2" >2</option>
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                </Form>
            </div>
            <div className="modal-footer">
                <Button
                    color="secondary"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setState(!state)}
                >
                    Cerrar
                </Button>
                <Button color="primary" type="button" >
                    Guardar
                </Button>
            </div>
        </Modal>
      <GridItem xs={12} sm={12} md={12}>
          <div className={classes.textRight}>
            <Button color="primary" onClick={() => setState(!state)} >Agregar nueva localización</Button>
          </div>
        <Card plain>
            <RemoteTable title="Lista de tiendas" urlfetch="http://ec2-34-219-142-13.us-west-2.compute.amazonaws.com/api/v1/warehouselocations/getall?warehouse_id=1"
              columns='[{ "title": "id", "field": "id" },{ "title": "Tienda", "field": "warehouse.store.name" }, { "title": "Bodega", "field": "warehouse.name" }, { "title": "Rack", "field": "rack"},{ "title": "Bloque", "field": "block" }, { "title": "Nivel", "field": "level" }, { "title": "Cadena de ubicacion", "field": "mapped_string" }]' />
        </Card>
      </GridItem>
    </Grid>
  );
}
