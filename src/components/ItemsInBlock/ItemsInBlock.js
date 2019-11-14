import React from 'react';
import MaterialTable from 'material-table';
import { connect } from 'store';
import materialTableLocaleES from '../MaterialTableLocaleES';
var Barcode = require('react-barcode');

const renderDetail = (rowData) => {
	let columns = [
		{"title": 'Id', "field": "id"},
		{"title": 'SKU', "field": "sku"},
		{ title: 'Talla', field: 'name' },
		{ title: 'Inventario', field: 'stock' },
		{ title: 'Precio', field: 'price' },
	];
	return <MaterialTable
		  title={'Detalle de producto '+rowData.name}
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
		  { title: 'Estilo', field: 'internal_reference' },
		  { title: 'Proveedor', field: 'provider' },
		  { title: 'Producto', field: 'name' },
		  { title: 'Depto', field: 'parent_name' },
		  { title: 'Categoria', field: 'family' },
		  { title: 'Color', field: 'colors_es' },	  		  
		];
		return <React.Fragment>
		<Barcode value={itemsInBlock.data.mapped_string} />
		<MaterialTable
		  title="Productos en la ubicacion"
		  columns={itemColumns}
		  data={itemsInBlock.data.data}
		  localization={materialTableLocaleES}  
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
		    search: false,              		    		    
		    maxBodyHeight: 500
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
