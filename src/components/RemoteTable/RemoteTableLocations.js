import React, {useEffect, useState} from "react";
import MaterialTable from 'material-table';
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../Snackbar/SnackbarFancy";
import Tooltip from "@material-ui/core/Tooltip";
import materialTableLocaleES from "../MaterialTableLocaleES";
import * as overlay from '../loader';
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from '@material-ui/icons/Filter';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';

export default function RemoteTable(props) {
    const { title, columns, urlfetch} = props;
    const [sliders, setSliders] = useState({});
    const [pageLength,setPageLength] = useState(50);
    const handleChange = (props) => event => {
        let name = "chk"+props.tableData.id;
        let chk = event.target.checked;
        overlay.showLoader();
        saveData(name,props,chk);
    };

    const downloadSticker = (context_id, allRack) => {
        overlay.showLoader();
      const fetchOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer '+localStorage.getItem('token'),
        },
      };
      let props, filename;
      if (allRack === true) {
        props = '?rack_id='+context_id;
        filename = 'rack '+context_id+'.pdf';
      } else {
        props = '?warehouselocation_id='+context_id;
        filename = 'ubicacion '+context_id+'.pdf';
      }
      const url = process.env.REACT_APP_API_LOCATION + '/warehouselocations/printsticker'+props;
      fetch(url, fetchOptions)
        .then((response) => {
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
              overlay.hideLoader();
          });

      });
    };

    const [openSnack,setOpenSnack] = useState(false);
    const [msg,setMsg] = useState({msg  :"",typeMsg : "info"});

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const handleOpenSnack = () => {
        setOpenSnack(true);
    };

    async function saveData(name, props,chk) {
        let url= process.env.REACT_APP_API_LOCATION+"/warehouselocations/editlocationactive?";
        const params = {
            method  : "POST",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+localStorage.getItem('token')
            }
        };
        url +="id="+props.id+"&chk="+chk;
        const res = await fetch(url,params);
        setTimeout(function(){
            res
                .json()
                .then(res => {
                    overlay.hideLoader();
                    setMsg({msg:"Datos actualizados",typeMsg: "success" });
                    handleOpenSnack();
                    setSliders({ ...sliders, [name]: chk });
                })
                .catch(err => {
                    console.log(err);
                    setMsg({ msg : "Ups! Hubo un error en la solicitud", typeMsg: "error"});
                    handleOpenSnack();
                    overlay.hideLoader();
                });
        },550);
    }

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
                            'column': 'warehouse_id',
                            'order': 'asc'
                        }
                        let headers = {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer '+localStorage.getItem('token'),
                        }
                        url += '&per_page=' + query.pageSize;
                        url += '&page=' + (query.page + 1);
                        if(String(query.orderBy)!=="undefined"){
                            order.order     = query.orderDirection;
                            order.column    = query.orderBy["field"];
                        }

                        url +="&column="+order.column+"&order="+order.order+"&q="+query.search;

                        fetch(url, {
                            headers: headers,
                        })
                            .then(response => response.json())
                            .then(result => {
                                let r = [false,true];
                                let temp=[];
                                let i=0;
                                let obj = result.data.reduce((object,item) => {
                                    temp["chk"+i++]=r[item.active];
                                    return temp;
                                },{});
                                setSliders(obj);
                                setPageLength(Number(result.per_page));
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
                    pageSize: pageLength ,
                    debounceInterval: 350,
                    maxBodyHeight: 600,
                    search: true,
                    padding: 'dense',
                    actionsColumnIndex: -1,
                    pageSizeOptions: [5,10,20,50,100]
                }}

                actions={[
                  {
                    icon: 'crop_original',
                    tooltip: 'Imprimir etiqueta',
                    onClick: (event, rowData) => downloadSticker(rowData.id, false)
                  },
                  {
                    icon: 'filter',
                    tooltip: 'Imprimir etiquetas de todo el rack',
                    onClick: (event, rowData) => downloadSticker(rowData.rack_id, true)
                  },
                    {
                        icon: 'toggle_off',
                        tooltip: 'Estado del Rack',
                        onClick: (event, rowData) => downloadSticker(rowData.rack_id, true)
                    }
                ]}

                components={{
                    Action: props => {
                        switch (props.action.icon) {
                            case "toggle_off":
                                return (
                                    <Tooltip title={props.action.tooltip}>
                                        <Switch checked={sliders["chk" + props.data.tableData.id] || false}
                                                onClick={handleChange(props.data)} value={"checked" + props.data.tableData.id}/>
                                    </Tooltip>
                                )
                                break;

                            case "crop_original":
                                return(
                                    <Tooltip title={props.action.tooltip}>
                                        <IconButton size={props.size} aria-label="crop_original" onClick={(event) => props.action.onClick(event, props.data)} >
                                            <CropOriginalIcon />
                                        </IconButton>
                                    </Tooltip>
                                )
                                break;

                            case "filter":
                                return(
                                    <Tooltip title={props.action.tooltip}>
                                        <IconButton size={props.size} aria-label="filter" onClick={(event) => props.action.onClick(event, props.data)} >
                                            <FilterIcon />
                                        </IconButton>
                                    </Tooltip>
                                )
                                break;
                        }
                    }
                }}
            />
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={openSnack}
                    autoHideDuration={1500}
                    onClose={handleCloseSnack}
                >
                    <MySnackbarContentWrapper
                        onClose={handleCloseSnack}
                        variant={msg.typeMsg}
                        message={msg.msg}
                    />
                </Snackbar>
            </div>
        </div>
    );
}