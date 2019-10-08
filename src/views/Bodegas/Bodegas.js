/*eslint-disable*/
import React, {useState ,useEffect} from "react";
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
import Button from "components/CustomButtons/Button.js";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { amber, green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textExtra :{
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width:200
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  textRight: {
    textAlign:"right",
  }
}) );


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
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN
  }

  const sides = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    }
  ];
  const [bodegas, setWarehouse] = useState([])
  const [open, setOpen] = useState(false);
  const [hasError, setErrors] = useState(false);

  const classes = useStyles();
  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const [values, setValues] = useState({
    name: '',
    sides:1,
    warehouse:1,
    blocks:0,
    levels:0,
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  async function fetchData() {
    const params = {
      method: "GET",
      headers: headers
    }
    const res = await fetch(process.env.REACT_APP_API_LOCATION+"/warehouses/getall?store_id=1",params);
    res
        .json()
        .then(res => {
          let wr = res.data.map(db => {
            return {value:db.id,label:db.name};
          });
          setWarehouse(wr);
        })
        .catch(err => setErrors(err));
  }

  async function saveData(data) {
    let url= process.env.REACT_APP_API_LOCATION+"/warehouselocations/maplocations?";
    const params = {
      method: "POST",
      headers: headers,
      //body: JSON.stringify()
    }
    url += "blocks="+data.get("blocks")+"&levels="+data.get("levels")+"&sides="+data.get("sides");//+"&warehouse_id="+data.get("warehouse");
    const res = await fetch(url,params);
    res
        .json()
        .then(res => {
          console.log(res);
          handleClose();
        })
        .catch(err => setErrors(err));
  }

  const sendInfo = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    saveData(data);
  }

  useEffect(() => {
    fetchData();
  },[]);

  const useStyles1 = makeStyles(theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }));

  function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
                {message}
        </span>
            }
            action={[
              <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
            {...other}
        />
    );
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Button variant="contained" type="button" color="primary" onClick={handleOpen}>Agregar un nuevo rack</Button>
        <Card plain>
            <RemoteTable title="Lista de tiendas" urlfetch={process.env.REACT_APP_API_LOCATION+"/warehouselocations/getall?warehouse_id=1"} 
              columns={bodegasColumns} />
        </Card>
      </GridItem>
      <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          disableBackdropClick = {true}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title">Nueva ubicación</h4>
            <p id="transition-modal-description">
              <small> Seleccione la cantidad de niveles y lados para crear la localización correspondiente</small>
            </p>
            <form onSubmit={sendInfo}>
                <TextField
                    id="warehouse"
                    name = "warehouse"
                    select
                    label="Bodegas activas"
                    className={classes.textExtra}
                    value={values.name}
                    onChange={handleChange('name')}
                    margin="normal"
                    variant="outlined"
                >
                  {bodegas.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                  ))}
                </TextField>
                <TextField
                    id="blocks"
                    label="Bloques"
                    name="blocks"
                    inputProps={{ min: "0", max: "50", step: "1" }}
                    value={values.blocks}
                    onChange={handleChange('blocks')}
                    type="number"
                    className={classes.textField}
                    min="0"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="levels"
                    name="levels"
                    label="Niveles"
                    inputProps={{ min: "0", max: "50", step: "1" }}
                    value={values.levels}
                    onChange={handleChange('levels')}
                    type="number"
                    min={0}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id = "sides"
                    name = "sides"
                    select
                    label="Lados"
                    className={classes.textField}
                    value={values.sides}
                    onChange={handleChange('sides')}
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                      },
                    }}
                    helperText="Seleccione la cantidad de lados de la ubicación"
                    margin="normal"
                    variant="outlined"
                >
                  {sides.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                  ))}
                </TextField>
              <div className={classes.textRight} >
                <Button type="button" variant="contained" color="warning" >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="success" >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
      >
        <MySnackbarContentWrapper
          onClose={handleClose}
          variant="success"
          message="This is a success message!"
      />
      </Snackbar>
    </GridContainer>
  );
}
