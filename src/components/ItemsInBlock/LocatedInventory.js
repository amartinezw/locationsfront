import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, MenuItem, Fab, FormControlLabel, Checkbox,
} from '@material-ui/core';
import MaterialTable from 'material-table';


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


export default function LocatedInventory() {
  const classes = useStyles();

  const tableRef = React.createRef();

  const [state, setState] = React.useState({
    notLocated: false,
    department: 'TODOS',
    active: 0,
    product: '',
    sku: '',
    filters: [{ name: 'active', value: 0 }],
    filtersChanged: false,
  });

  const handleChangeCheckBox = (name) => (event) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleChange = (name) => (event) => {
    setState({ ...state, [name]: event.target.value });
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
    if (state.department !== 'TODOS') {
      filters.push({ name: 'department', value: state.department });
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
    { title: 'Id', field: 'id' },
    { title: 'Estilo', field: 'internal_reference' },
    { title: 'Proveedor', field: 'provider' },
    { title: 'Producto', field: 'name' },
    { title: 'Color', field: 'colors_es' },
    {
      title: 'Ubicacion',
      field: 'mapped_string',
      render: (rowData) => {
        if (rowData.locations) {
          return rowData.locations.map((location) => (
            <x>
              {location.warehouselocation.mapped_string}
              <br />
            </x>
          ));
        }
        return '';
      },

    },
  ];

  const urlfetch = `${process.env.REACT_APP_API_LOCATION}/locationvariation/getall`;

  return (
    <x>
      <form className={classes.container} noValidate autoComplete="off">
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
      <MaterialTable
        title="Inventario"
        columns={itemColumns}
        tableRef={tableRef}
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
        options={{
          pageSize: 10,
          search: false,
          debounceInterval: 500,
          headerStyle: { position: 'sticky', top: 0 },
          maxBodyHeight: '550px',
        }}
        detailPanel={(rowData) => renderDetail(rowData)}
      />
    </x>
  );
}
