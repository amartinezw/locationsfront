import React from 'react';
//import GridItem from "components/Grid/GridItem.js";
import MaterialTable from 'material-table';
import { connect } from 'store';
let Barcode = require('react-barcode');

const ItemsInBlock = ({ itemsInBlock }) => {
	if (itemsInBlock.data) {
		let itemColumns = [
		  { "title": "SKU", "field": "variation.sku" },
		  { "title": "Producto", "field": "variation.product.name" }, 
		  { "title": "Descripcion", "field": "variation.name" }, 
		  { "title": "Ubicacion", "field": "warehouselocation_id"}
		];
		return <React.Fragment>
		<Barcode value={itemsInBlock.data.mapped_string} />
		<MaterialTable
		  title="Productos en la ubicacion"
		  columns={itemColumns}
		  data={itemsInBlock.data.data}        
		  options={{
		    pageSize: 20,              
		    debounceInterval: 500,            
		  }}
		  />
		 </React.Fragment>
	} else {
		return '...';
	}
}	

export default connect(({ itemsInBlock }) => ({ itemsInBlock }))(ItemsInBlock)
