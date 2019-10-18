import React from 'react';
import MaterialTable from 'material-table';
import { connect } from 'store';
var Barcode = require('react-barcode');

const renderDetail = (rowData) => {
	let columns = [
		{"title": 'Id', "field": "id"},
		{"title": 'SKU', "field": "sku"},
		{"title": 'Talla', "field": "name"},
	];
	return <MaterialTable
		  title="hola"
		  columns={columns}
		  data={rowData.variations}    
		  options={{
		  	search: false,
		  	paging: false,
		  	showTitle: false,
		  	toolbar: false
		  }}    		  		  
	  />
}

const ItemsInBlock = ({ itemsInBlock }) => {	
	if (itemsInBlock.data) {
		let itemColumns = [
		  { "title": "Imagen", "field": "firstimg.file", render: rowData => {
		  	if (rowData.images.length > 0) {
		  		return <img src={'https://dsnegsjxz63ti.cloudfront.net/images/pg/g_'+rowData.images[0].file}
		  		 onError={e => {
		  		 	e.target.src = '/images/Box_Empty.png';
		  		 }}
		  		 alt=""
		  		 style={{width: 100}}/>;
		  	} else {
		  		return <img src="/images/Box_Empty.png" alt="" style={{width: 100}}/>;
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
		    headerStyle: { position: 'sticky', top: 0 }, 
		    maxBodyHeight: '550px'            
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
