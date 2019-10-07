import React from "react";
import ReactDOM from 'react-dom'
import MaterialTable from 'material-table'
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

export default function RemoteTable(props) {  
  const { title, columns, urlfetch, ...rest} = props;
  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={(query) =>
        new Promise((resolve, reject) => {                                    
          let url = urlfetch
          let headers = {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
          }

          url += '&per_page=' + query.pageSize
          url += '&order=' + 'asc'
          url += '&column=' + 'id'
          url += '&page=' + (query.page + 1)
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
        pageSize: 20,              
        debounceInterval: 500,            
      }}
    />
  );
}

