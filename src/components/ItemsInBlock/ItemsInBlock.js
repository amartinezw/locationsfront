import React from 'react';
import GridItem from "components/Grid/GridItem.js";
import MaterialTable from 'material-table';
import { actions, connect } from 'store';
var Barcode = require('react-barcode');

const renderDetail = (rowData) => {
	let columns = [
		{"title": 'Id', "field": "id"},
		{"title": 'SKU', "field": "sku"},
		{"title": 'Talla', "field": "name"},
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

const ItemsInBlock = ({ itemsInBlock }) => {	
	if (itemsInBlock.data) {
		let itemColumns = [
		  { "title": "Imagen", "field": "firstimg.file", render: rowData => {
		  	if (rowData.images.length > 0) {
		  		return <img src={'https://dsnegsjxz63ti.cloudfront.net/images/pg/g_'+rowData.images[0].file}
		  		 onError="this.onError=null; this.src='/images/Box_Empty.png'"
		  		 style={{width: 100}}/>;
		  	} else {
		  		return <img src="/images/Box_Empty.png" style={{width: 100}}/>;
		  	} 
		  }},
		  { "title": "Id", "field": "id" },
		  { "title": "Estilo", "field": "internal_reference" },
		  { "title": "Producto", "field": "name" }, 		  
		  { "title": "Ubicacion", "field": "mapped_string", render: () => {return itemsInBlock.data.mapped_string}}
		];
		return <React.Fragment>
		<Barcode value={itemsInBlock.data.mapped_string} />
		<MaterialTable
		  title="Productos en la ubicacion"
		  columns={itemColumns}
		  data={itemsInBlock.data.data}        
		  options={{
		    pageSize: 20,
		    search: false,              
		    debounceInterval: 500,            
		  }}
		  detailPanel={rowData => {
            return renderDetail(rowData);
          }}
		  />
		 </React.Fragment>
	} else {
		return '...';
	}
}	

export default connect(({ itemsInBlock }) => ({ itemsInBlock }))(ItemsInBlock)
