import React, {useState} from "react";
import MaterialTable from 'material-table';
//import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import MySnackbarContentWrapper from "../Snackbar/SnackbarFancy";

export default function RemoteTable(props) {
    const { title, columns, urlfetch} = props;
    const [state, setState] = useState({});
    //const [disabledState, setDisabledState] = useState({disabled1:false});
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
                    setState({ ...state, [name]: chk });
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
                    maxBodyHeight: 400,
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

