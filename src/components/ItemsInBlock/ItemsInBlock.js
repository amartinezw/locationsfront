import React from 'react';
import MaterialTable from 'material-table';
import { connect } from 'store';
import materialTableLocaleES from '../MaterialTableLocaleES';
import Button from '@material-ui/core/Button';

const Barcode = require('react-barcode');

const renderDetail = (rowData) => {
  const columns = [
    { title: 'Id', field: 'id' },
    { title: 'SKU', field: 'sku' },
    { title: 'Talla', field: 'name' },
    { title: 'Inventario', field: 'stock' },
    { title: 'Precio', field: 'price' },
    { title: 'Color', field: 'color.name' },
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
      title={`Detalle de producto ${rowData.name}`}
      columns={columns}
      data={rowData.variations}
      options={{
        search: false,
        paging: false,
        showTitle: false,
        padding: 'dense',
        toolbar: false,
      }}
    />
  );
};


const downloadSticker = (context, identifier, format) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: 'Bearer '+localStorage.getItem('token'),
    },
  };
  const url = `${process.env.REACT_APP_API_LOCATION}/locationvariation/printsticker?${context}=${identifier}&format=${format}`;
  fetch(url, fetchOptions)
    .then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${context} ${identifier}.pdf`;
        a.click();
      });
    });
};

const ItemsInBlock = ({ itemsInBlock }) => {
  if (itemsInBlock.data) {
    const itemColumns = [
      {
        title: 'Imagen',
        field: 'firstimg.file',
        render: (rowData) => {
          if (rowData.images.length > 0) {
            return (
              <img
                src={`https://dsnegsjxz63ti.cloudfront.net/images/pg/g_${rowData.images[0].file}`}
                onError={(e) => {
                  e.target.src = '/images/Box_Empty.png';
                }}
                alt=""
                style={{ width: 100 }}
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
    return (
      <React.Fragment>
        {
          itemsInBlock.data.mapped_string ? (
            <React.Fragment>
              <Barcode value={itemsInBlock.data.mapped_string} />
              <Button 
                variant="contained" 
                style={{marginBottom: '15px'}} 
                onClick={() => {downloadSticker('warehouselocation_id', itemsInBlock.data.warehouselocation_id, 'portrait')}}
              >
                Imprimir etiquetas V
              </Button>
              <Button 
                variant="contained"
                style={{marginBottom: '15px'}}
                color="secondary"
                onClick={() => {downloadSticker('warehouselocation_id', itemsInBlock.data.warehouselocation_id, 'landscape')}}
              >
                Imprimir etiquetas H
              </Button>
            </React.Fragment>
          ) : '' 
        }        
        <MaterialTable
          title="Productos en la ubicacion"
          columns={itemColumns}
          data={itemsInBlock.data.data}
          localization={materialTableLocaleES}
          actions={[
            {
              icon: 'crop_original',
              tooltip: 'Imprimir etiqueta vertical',
              onClick: (event, rowData) => downloadSticker('product_id', rowData.id, 'portrait'),
            },
            {
              icon: 'filter',
              tooltip: 'Imprimir etiqueta horizontal',
              onClick: (event, rowData) => downloadSticker('product_id', rowData.id, 'landscape'),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            search: false,
            maxBodyHeight: '70vh',
            padding: 'dense',
            toolbar: false,
          }}
          detailPanel={(rowData) => renderDetail(rowData)}
        />
      </React.Fragment>
    );
  }
  return '';
};

export default connect(({ itemsInBlock }) => ({ itemsInBlock }))(ItemsInBlock);
