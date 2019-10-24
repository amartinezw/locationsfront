import React, {useState} from "react";
import MaterialTable from 'material-table'
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
//import Tooltip from "@material-ui/core/Tooltip";
// import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

export default function RemoteTable(props) {  
    const { title, columns, urlfetch} = props;
    const [state, setState] = useState({});
    const [disabledState, setDisabledState] = useState({disabled1:false});
    const loader = document.querySelector('.overlay');

    const showLoader = () =>{
        loader.classList.remove('overlay--hide');
        loader.classList.add('overlay--show');
    }
    const hideLoader = () => {
        loader.classList.remove('overlay--show');
        loader.classList.add('overlay--hide');
    }

    const handleChange = (props) => event => {
        let name = "chk"+props.tableData.id;
        let chk = event.target.checked;
        saveData(name,props,chk);
        showLoader();

    };

    async function saveData(name, props,chk) {
        console.log(name,props,chk);
        let url= process.env.REACT_APP_API_LOCATION+"/warehouselocations/editlocationactive?";
        const params = {
            method  : "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN
            }
        }
        url +="id="+props.id+"&chk="+chk;
        //url += "blocks="+data.get("blocks")+"&levels="+data.get("levels")+"&sides="+data.get("sides")+"&warehouse_id="+data.get("warehouse");
        const res = await fetch(url,params);
        setTimeout(function(){
            res
                .json()
                .then(res => {
                    console.log(res);
                    hideLoader();
                    setState({ ...state, [name]: chk });
                })
                .catch(err => {
                    console.log(err);
                    hideLoader();
                    setState({ ...state, [name]: chk });
                });
        },350)
    }

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
                        let r = [false,true,false];
                        let temp=[];
                        let i=0;
                        let obj = result.data.reduce((obj,item) => {
                           temp["chk"+i]=r[(Math.floor(Math.random() * 2) + 1)];
                           i++;
                           return temp;
                        },{});
                        setState(obj);
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
                search: true,
                actionsColumnIndex: -1
            }}
            actions={[
                rowData => ({
                    tooltip:"Desactivar ubicación",
                })
            ]}
            components={{
                Action: props => (
                    <Switch checked={state["chk"+props.data.tableData.id]||false} onClick={handleChange(props.data)} value={"checked"+props.data.tableData.id} />
                ),
            }}
    />
  );
}

