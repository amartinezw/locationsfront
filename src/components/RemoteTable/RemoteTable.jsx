import React from "react";
import MaterialTable from 'material-table'
//import FormControlLabel from "@material-ui/core/FormControlLabel";
/*import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../Snackbar/SnackbarFancy";
import Slide from '@material-ui/core/Slide';*/
import materialTableLocaleES from '../MaterialTableLocaleES';
//import Tooltip from "@material-ui/core/Tooltip";
// import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

export default function RemoteTable(props) {  
    const { title, columns, urlfetch} = props;

    return (
        <div>
        <MaterialTable
            title={title}
            columns={columns}
            localization={materialTableLocaleES}
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
                        order.column = query.orderBy["field"];
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
                pageSize: 10,
                debounceInterval: 500,
                maxBodyHeight: '70vh',
                search: true,
                padding: 'dense',
                actionsColumnIndex: -1
            }}
    />
        </div>
  );
}

