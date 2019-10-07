import React from "react";
import MaterialTable from 'material-table'

export default class RemoteTableUser extends React.Component{

    constructor (props){
        super(props);
        this.serverApi = process.env.REACT_APP_API_LOCATION;
        this.methods = {
            show    : this.serverApi+'/user/getusers?',
            delete  : this.serverApi+'/user/delete/',
            edit    : this.serverApi+'/user/update/'
        }
        this.query = "";
        this.state = {
            columns: [
                { title: "id", field: "id" },
                { title: "Nombre", field: "name" },
                { title: "Email", field: "email" },
                { title: "Direccion", field: "address"},
                { title: "Creación", field: "created_at" },
            ],
            data :[]
        }
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
        }
    }

    show($query){
        this.query = $query;
        let $return;
        $return = new Promise((resolve, reject) => {
            let $url = this.methods.show;
            $url += "per_page="+this.query.pageSize+"&page="+(this.query.page+1);
            let $params = {
                method  : "get",
                headers : this.headers
            }
            fetch($url,$params)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    resolve({
                        data: result.data,
                        page: (result.current_page-1),
                        totalCount:result.total
                    });
                    console.log("one Charge");
                });
        });

        return $return;
    }

    delete($oldData){
        let $return;
        $oldData['per_page']= this.query.totalCount;
        console.log($oldData);

        let $params = {
            method: "GET",
            headers: this.headers
        };

        $return =  new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.delete+$oldData.id;
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        if(result.success){
                            this.cache = {
                                data: result.data[0].data,
                                page: result.data[0].current_page-1,
                                totalCount: result.data[0].total
                            }
                        }else{

                        }
                        resolve(this.cache);
                    })
                    .catch(error => {
                        console.log(error);
                        resolve(this.cache);
                    });
            }, 600);
        })

        return $return;
    }

    edit(newData,oldData){
        let $return;
        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(newData)
        };

        $return = new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.edit+oldData.id;
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(!result.success){

                        }
                        resolve();
                    })
                    .catch(error => {
                        console.log(error);
                        resolve(this.cache);
                    });
            }, 600);
        })
        return $return;
    }

    render(){
        return (
            <div>
                <MaterialTable
                    title={this.props.title}
                    columns={ this.state.columns }
                    data={ $query => this.show($query)}
                    editable={{
                        onRowUpdate: (newData, oldData) => this.edit(newData,oldData),
                        onRowDelete: oldData => this.delete(oldData)
                    }}
                    options={{
                        pageSize: 20,
                        debounceInterval: 500,
                        search: true,
                        sorting: true,
                        actionsColumnIndex: -1,
                        rowStyle: {
                            backgroundColor: '#EEE',
                        }
                    }}
                    localization={{
                        body: {
                            editRow: {
                                deleteText : "¿Realmente desea eliminar el registro?",
                                cancelTooltip : "Cancelar",
                                saveTooltip: "Proceder"
                            },
                        }
                    }}
                />
            </div>
        );
    }
}