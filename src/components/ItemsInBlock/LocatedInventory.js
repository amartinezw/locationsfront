import React, {useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, MenuItem, Fab, FormControlLabel, Checkbox,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import materialTableLocaleES from '../MaterialTableLocaleES';
import GridItem from "../Grid/GridItem";

const renderDetail = (rowData) => {
  const columns = [
    { title: 'SKU', field: 'sku' },
    { title: 'Talla', field: 'name' },
    { title: 'Inventario', field: 'stock' },
    { title: 'Precio', field: 'price' },
    {
      title: 'Ubicacion(es)',
      field: 'locations',
      render: (rowData) => {
        const locationsString = [];
        if (rowData.locations) {
          rowData.locations.map((location) => locationsString.push(location.warehouselocation.mapped_string));
          return locationsString.join(', ');
        }
        return '';
      },
    },
  ];
  return (
    <MaterialTable
      columns={columns}
      data={rowData.variations}
      options={{
        search: false,
        paging: false,
        padding: 'dense',
        toolbar: false,
      }}
    />
  );
};

const useStyles = makeStyles((theme) => ({
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
    marginBottom: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  fab: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),    
    marginBottom: theme.spacing(1),
  },
  menu: {
    width: 200,
  },
}));


export default function LocatedInventory() {
  const classes = useStyles();
  const tableRef = React.createRef();
  const [state, setState] = useState({
    notLocated: false,
    active: 0,
    product: '',
    sku: '',
    filters: [{ name: 'active', value: 0 }],
    filtersChanged: false,
    select : [{id:-1,name:"Todas"}],
    subSelect : [{id:-1,name:"Todas"}]
  });

  const[department,setDepartment] = useState(-1);
  const[subCategory,setSubCategory] = useState(-1);

  const downloadSticker = (product_id, format) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: process.env.REACT_APP_API_TOKEN,
      },
    };
    const url = process.env.REACT_APP_API_LOCATION + '/locationvariation/printsticker?product_id=' + product_id + '&format=' + format;
    fetch(url, fetchOptions)
      .then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'product '+product_id+'.pdf';
          a.click();
        });
        
    });
  }

  async function getParent(){
    let url = process.env.REACT_APP_API_LOCATION+"/categories/parent";
    const params = {
      method  : "GET",
      headers : {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN
      }
    };
    const res = await fetch(url,params);
    let values = [{id:-1,name:"Todas"}];
    res
        .json()
        .then(res => {
          res.map((item,i)=>{
            values.push({id:item.id,name:item.name});
          });
          setState({ ...state,select: values});
        })
        .catch(err => {
          console.log(err);
        });
  }

  async function getChildren(parent) {
    let url = process.env.REACT_APP_API_LOCATION+"/categories/child/"+parent;
    const params = {
      method  : "GET",
      headers : {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN
      }
    };
    const res = await fetch(url,params);
      res
          .json()
          .then(res => {
            let values = [{id:-1,name:"Todas"}];
            res.map((item,i)=>{
              values.push({id:item.id,name:item.name});
            });
            setState({ ...state,subSelect: values});
          })
          .catch(err => {
            console.log(err);
          });
  }
  useEffect(()=>{
    getParent();
  },[]);

  const handleChangeCheckBox = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleChange = (name) => (event) => {
    if(name==="department"){
      setSubCategory(-1);
      setDepartment(event.target.value);
      getChildren(event.target.value);
    }else if(name==="subCategory"){
      setSubCategory(event.target.value);
    }else{
      setState({ ...state, [name]: event.target.value });
    }
  };

  const handleSearch = () => {
    const filters = [];
    filters.push({ name: 'active', value: state.active });

    if (state.notLocated === true) {
      filters.push({ name: 'notLocated', value: state.notLocated });
    }
    if (state.product !== '') {
      filters.push({ name: 'name', value: state.product });
    }
    if (state.sku !== '') {
      filters.push({ name: 'sku', value: state.sku });
    }
    if (state.subSelect !== '-1') {
      filters.push({ name: 'subcategory', value: subCategory});
    }
    if (state.department !== '-1') {
      filters.push({ name: 'department', value: department });
    }

    setState({ ...state, filters, filtersChanged: true });
    return tableRef.current && tableRef.current.onQueryChange();
  };

  const itemColumns = [
    {
      title: 'Imagen',
      field: 'firstimg.file',
      render: (rowData) => {
        if (rowData.images.length > 0) {
          return (
            <img
              src={`https://dsnegsjxz63ti.cloudfront.net/images/pg/g_${rowData.images[0].file}`}
              style={{ width: 100 }}
              alt=""
              onError={(e) => {
                e.target.src = '/images/Box_Empty.png';
              }}
            />
          );
        }
        return <img src="/images/Box_Empty.png" alt="" style={{ width: 100 }} />;
      },
    },    
    { title: 'Estilo', field: 'internal_reference' },
    { title: 'Proveedor', field: 'provider' },
    { title: 'Producto', field: 'name' },
    { title: 'Depto', field: 'parent_name' },
    { title: 'Categoria', field: 'family' },
    { title: 'Color', field: 'colors_es' },
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

  const urlfetch = `${process.env.REACT_APP_API_LOCATION}/locationvariation/getall`;

  return (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">        
        <TextField
          id="outlined-select-currency"
          select
          label="Categorias"
          className={classes.textField}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          value={department}
          onChange={handleChange('department')}
          helperText="Seleccione una categoria"
          margin="dense"
          variant="outlined"
        >
          {state.select.map(item =>(<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
        </TextField>
        <TextField
            id="outlined-select-subcategory"
            select
            label="Sub-Categorias"
            className={classes.textField}
            SelectProps={{
              MenuProps: {
                className: classes.menu,
              },
            }}
            value={subCategory}
            onChange={handleChange('subCategory')}
            helperText="Seleccione la subcategoria"
            margin="dense"
            variant="outlined"
        >
          {state.subSelect.map(item =>(<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
        </TextField>
        <TextField
          id="outlined"
          label="Producto"
          value={state.product}
          onChange={handleChange('product')}
          className={classes.textField}
          margin="dense"
          variant="outlined"
        />
        <TextField
          id="outlined"
          label="SKU"
          value={state.sku}
          onChange={handleChange('sku')}
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
          value={state.active}
          onChange={handleChange('active')}
          margin="dense"
          variant="outlined"
        >
          <MenuItem key="0" value="-1">
            Ambos
          </MenuItem>
          <MenuItem key="1" value="0">
           Activo
          </MenuItem>
          <MenuItem key="2" value="1">
           Inactivo
          </MenuItem>
        </TextField>
        <Fab variant="extended" size="small" aria-label="delete" className={classes.fab} onClick={() => handleSearch()}>
          <SearchIcon className={classes.extendedIcon} />
         Buscar
        </Fab>
        <FormControlLabel
          control={(
            <Checkbox
              checked={state.notLocated}
              onChange={handleChangeCheckBox('notLocated')}
              value="notLocated"
              color="primary"
            />
          )}
          className={classes.FormControlLabel}
          label="Productos sin ubicar"
        />
      </form>
      <MaterialTable
        title="Inventario"
        columns={itemColumns}
        tableRef={tableRef}
        localization={materialTableLocaleES}
        data={
      (query) => new Promise((resolve) => {
        if (state.filtersChanged === true) {
          query.page = 0;
          setState({ ...state, filtersChanged: false });
        }
        let url = urlfetch;
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
        };
        url += `?per_page=${query.pageSize}`;
        url += '&order=asc';
        url += '&column=id';
        url += `&page=${query.page + 1}`;

        state.filters.map((filter) => {
          url += `&${filter.name}=${filter.value}`;
          return true;
        });

        fetch(url, {
          headers,
        })
          .then((response) => response.json())
          .then((result) => {
            resolve({
              pageSize: result.per_page,
              data: result.data,
              page: result.current_page - 1,
              totalCount: result.total,
            });
          });
      })
    }
        actions={[
          {
            icon: 'crop_original',
            tooltip: 'Imprimir etiqueta vertical',
            onClick: (event, rowData) => downloadSticker(rowData.id, "portrait")
          },
          {
            icon: 'filter',
            tooltip: 'Imprimir etiqueta horizontal',
            onClick: (event, rowData) => downloadSticker(rowData.id, "landscape")
          }
        ]}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          search: false,
          toolbar: false,
          padding: 'dense',          
          debounceInterval: 500,
          headerStyle: { position: 'sticky', top: 0 },
          maxBodyHeight: '70vh',
        }}
        detailPanel={(rowData) => renderDetail(rowData)}
      />
    </React.Fragment>
  );
}
