import React, {useState} from "react";
import MaterialTable from 'material-table'

export default function RemoteTable(props) {  
    const { title, columns, urlfetch} = props;

    return (
        <div>
        <MaterialTable
            title={title}
            columns={columns}
            data={(query) =>
                new Promise((resolve, reject) => {
                    let url = urlfetch
                    let order = {
                        'column'    : 'warehouse_id',
                        'order' : 'asc'
                    }

                    let headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
                    }
                    url += '&per_page=' + query.pageSize;
                    url += '&page=' + (query.page + 1);
                    if(query.orderBy!==undefined){
                        order.order = query.orderDirection;
                        order.column    = query.orderBy["field"];
                    }

                    url +="&column="+order.column+"&order="+order.order+"&q="+query.search;

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
                maxBodyHeight: 400,
                search: true,
                actionsColumnIndex: -1
            }}
    />
        </div>
  );
}

