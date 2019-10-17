import React from "react";
import MaterialTable from 'material-table'
// import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

export default function RemoteTable(props) {  
    const { title, columns, urlfetch} = props;
    return (
        <MaterialTable
            title={title}
            columns={columns}
            data={(query) =>
                new Promise((resolve, reject) => {
                    let url = urlfetch
                    let order = {
                        'column'    : 'warehouse_id',
                        'direction' : 'asc'
                    }

                    let headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
                    }
                    console.log(query);
                    url += '&per_page=' + query.pageSize;
                    url += '&page=' + (query.page + 1);
                    if(query.orderBy!=undefined){
                        order.direction = query.orderDirection;
                        order.column    = query.orderBy["field"];
                    }

                    url +="&column="+order.column+"&direction="+order.direction+"&q="+query.search;

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
          search: true
      }}
    />
  );
}

