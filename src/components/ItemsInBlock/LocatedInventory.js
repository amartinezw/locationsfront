import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
import {TextField, MenuItem, Fab, FormControlLabel, Checkbox} from '@material-ui/core';
import MaterialTable from 'material-table';


const renderDetail = (rowData) => {
	let columns = [
		{"title": 'Id', "field": "id"},
		{"title": 'SKU', "field": "sku"},
		{"title": 'Talla', "field": "name"},
		{"title": 'Ubicacion(es)', "field": "locations", render: rowData => {
			let locations_string = [];
			if (rowData.locations) {
				rowData.locations.map(location => locations_string.push(location.warehouselocation.mapped_string));
				return locations_string.join(', ');
			}
			return "";
		}},
	];
	return <MaterialTable
		  title={'Detalle de producto '+rowData.name}
		  columns={columns}
		  data={rowData.variations}    
		  options={{
		  	search: false,
		  	paging: false
		  }}    		  		  
	  />
}

const useStyles = makeStyles(theme => ({
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
    marginLeft: theme.spacing(1)
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

	const handleChangeCheckBox = name => event => {
	      setState({ ...state, [name]: event.target.checked });        
	  };

	const handleChange = name => event => {        
	      setState({ ...state, [name]: event.target.value });       
	  };

	const handleSearch = () => {
	  let filters = [];
	  filters.push({name: "active", value:state.active});
	  if (state.notLocated === true) {
	    filters.push({name: "notLocated", value:state.notLocated});
	  }
	  if (state.product !== "") {
	    filters.push({name: "name", value:state.product});
	  }
	  if (state.sku !== "") {
	    filters.push({name: "sku", value:state.sku});
	  }
	  if (state.department !== "TODOS") {
	    filters.push({name: "department", value:state.department});
	  }
	  setState({ ...state, filters: filters, filtersChanged: true });	  
	  tableRef.current && tableRef.current.onQueryChange();
	}

	const [state, setState] = React.useState({
	  notLocated: false,
	  department: "TODOS",
	  active: 0,
	  product: "",
	  sku: "",
	  filters: [{name: "active", value: 0}],
	  filtersChanged: false       
	});
	
	
	const itemColumns = [
	  { "title": "Imagen", "field": "firstimg.file", render: rowData => {
	  	if (rowData.images.length > 0) {
	  		return <img src={'https://dsnegsjxz63ti.cloudfront.net/images/pg/g_'+rowData.images[0].file}		  		 
	  		 style={{width: 100}}
	  		 alt=""
	  		 onError={e => {
	  		 	e.target.src = '/images/Box_Empty.png';
	  		 }}/>;
	  	} else {
	  		return <img src="/images/Box_Empty.png" alt="" style={{width: 100}}/>;
	  	} 
	  }},
	  { "title": "Id", "field": "id" },
	  { "title": "Estilo", "field": "internal_reference" },
	  { "title": "Proveedor", "field": "provider" },
	  { "title": "Producto", "field": "name" }, 		  
	  { "title": "Ubicacion", "field": "mapped_string", render: () => {return ''}}
	];

	const urlfetch = process.env.REACT_APP_API_LOCATION+'/locationvariation/getall';

	return <React.Fragment>			
	<form className={classes.container} noValidate autoComplete="off">               
	     <FormControlLabel
	       control={
	         <Checkbox
	           checked={state.notLocated}
	           onChange={handleChangeCheckBox('notLocated')}
	           value="notLocated"
	           color="primary"
	         />
	       }
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
	       DAMAS
	       </MenuItem>                 
	       <MenuItem key="2" value="CABALLEROS">                   
	        CABALLEROS
	       </MenuItem>
	       <MenuItem key="3" value="DAMAS  COLLEGE">                   
	       DAMAS  COLLEGE
	       </MenuItem>
	       <MenuItem key="4" value="DAMAS  URBAN">
	       DAMAS  URBAN                   
	       </MenuItem>
	       <MenuItem key="5" value="DAMAS JR">                   
	       DAMAS JR
	       </MenuItem>
	       <MenuItem key="6" value="ZAPATERIA CABALLEROS">                                     
	       ZAPATERIA CABALLEROS
	       </MenuItem>                 
	       <MenuItem key="7" value="ZAPATERIA DAMAS">                                   
	       ZAPATERIA DAMAS
	       </MenuItem>
	       <MenuItem key="8" value="DAMAS CCP">                                     
	        DAMAS CCP
	       </MenuItem>
	       <MenuItem key="9" value="CABALLEROS CCP">                                     
	        CABALLEROS CCP
	       </MenuItem>
	       <MenuItem key="10" value="BEBES">                                     
	        BEBES
	       </MenuItem>
	       <MenuItem key="11" value="CABALLEROS  COLLEGE">                                     
	       CABALLEROS  COLLEGE
	       </MenuItem>
	       <MenuItem key="12" value="CABALLEROS  URBAN">                                     
	       CABALLEROS  URBAN
	       </MenuItem>
	       <MenuItem key="13" value="INTERIOR CABALLEROS CITY&CO">                                     
	       INTERIOR CABALLEROS CITY&CO
	       </MenuItem>                 
	       <MenuItem key="14" value="INTERIOR CABALLEROS CCP">                                     
	       INTERIOR CABALLEROS CCP                 
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
	  	(query) =>
  	        new Promise((resolve, reject) => {                                    
  	          if (state.filtersChanged === true) {
  	          	query.page = 0;
  	          	setState({...state, filtersChanged: false});
  	          }
  	          let url = urlfetch
  	          let headers = {
  	              "Accept": "application/json",
  	              "Content-Type": "application/json",
  	              "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
  	          }
  	          url += '?per_page=' + query.pageSize
  	          url += '&order=asc'
  	          url += '&column=id'
  	          url += '&page=' + (query.page + 1)
  	       	
  	       	  state.filters.map(filter => {
  	       	  	url += '&'+filter.name+'='+filter.value
  	       	  	return true
  	       	  })

  	          fetch(url, {            
  	            headers: headers,
  	          })
  	            .then(response => response.json())
  	            .then(result => {
  	              resolve({
  	                pageSize: result.per_page,
  	                data: result.data,
  	                page: result.current_page - 1,
  	                totalCount: result.total,
  	              })
  	            })
  	        })
	  }        
	  options={{
	    pageSize: 10,
	    search: false,              
	    debounceInterval: 500,            
	  }}
	  detailPanel={rowData => {
        return renderDetail(rowData);
      }}
	  />
	 </React.Fragment>			
	
	
}	