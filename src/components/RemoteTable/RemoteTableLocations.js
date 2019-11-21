import React, {useEffect, useState} from "react";
import MaterialTable from 'material-table';
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../Snackbar/SnackbarFancy";
import Tooltip from "@material-ui/core/Tooltip";
import materialTableLocaleES from "../MaterialTableLocaleES";

export default function RemoteTable(props) {
    const { title, columns, urlfetch} = props;
    const [sliders, setSliders] = useState({});
    const [pageLength,setPageLength] = useState(10);
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

    const downloadSticker = (context_id, allRack) => {
      const fetchOptions = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: process.env.REACT_APP_API_TOKEN,
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
          });
          
      });
    }

    const [openSnack,setOpenSnack] = useState(false);
    const [msg,setMsg] = useState({msg  :"",typeMsg : "info"});

    const handleCloseSnack = () => {
        setOpenSnack(false);
    }
    const handleOpenSnack = () => {
        setOpenSnack(true);
    }

    async function saveData(name, props,chk) {
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
        const res = await fetch(url,params);
        setTimeout(function(){
            res
                .json()
                .then(res => {
                    hideLoader();
                    setMsg({msg:"Datos actualizados",typeMsg: "success" });
                    handleOpenSnack();
                    setSliders({ ...sliders, [name]: chk });
                })
                .catch(err => {
                    console.log(err);
                    setMsg({ msg : "Ups! Hubo un error en la solicitud", typeMsg: "error"});
                    handleOpenSnack();
                    hideLoader();
                });
        },550)
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
                            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
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
                                setPageLength(result.per_page);
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
                    //maxBodyHeight: 400,
                    search: true,
                    padding: 'dense',
                    actionsColumnIndex: -1
                }}
                actions={[
                  {
                    icon: 'crop_original',
                    tooltip: 'Imprimir etiqueta',
                    onClick: (event, rowData) => downloadSticker(rowData.id, false)
                  }, 
                  {
                    icon: 'crop_original',
                    tooltip: 'Imprimir etiquetas de todo el rack',
                    onClick: (event, rowData) => downloadSticker(rowData.rack_id, true)
                  },                  
                ]}
                
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

