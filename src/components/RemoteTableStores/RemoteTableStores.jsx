import React from 'react';
import MaterialTable from 'material-table';
import ReactDOM from "react-dom";

export default class RemoteTableStores extends React.Component{

    constructor (props){
        super(props);
        this.serverApi = "http://ec2-34-219-142-13.us-west-2.compute.amazonaws.com/";
        this.query = "";
        this.state = {
            columns: [
                { title: 'ID Tienda',field : "store.id", type: "numeric", },
                { title: 'Num. Tienda', field: 'store.number', type: 'numeric' },
                { title: 'Nombre de la tienda', field: 'store.name' },
                { title: 'Num. Bodega (DB)', field: 'id', type: 'numeric' },
                { title: 'Nombre de la bodega', field: 'name' },
            ],
            data :[]
        }
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+this.props.key_,
        }
    }

    show($query){
        this.query = $query;
        let $return;
        console.log(this.props);
        $return = new Promise((resolve, reject) => {
            let $url = this.serverApi+'api/v1/warehouses/getall?';
            $url += "per_page="+this.query.pageSize+"&page="+(this.query.page+1);
            let $params = {
                method  : "get",
                headers : this.headers
            }
            fetch($url,$params)
            .then(response => response.json())
            .then(result => {
                resolve({
                    data: result.data,
                    page: (result.current_page-1),
                    totalCount:result.total
                });
            });
        });

        return $return;
    }

    add($newData){
        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify($newData)
        };
        console.log($newData);

        //let $result = new Promise(resolve => resolve());

        let $result = new Promise(resolve => {
            setTimeout(() => {
                let $url = this.serverApi+'api/v1/warehouses/store?store_id='+$newData.store.id;
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(!result.success){
                            let text = result.error.code;
                        }
                        resolve();
                    })
                    .catch(error => {
                        console.log(error);
                        resolve();
                    });

            }, 600);
        });

        return $result;
    }

    delete($oldData){
        let $return;
        $oldData['per_page']= this.cache.totalCount;
        console.log($oldData);

        let $params = {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify($oldData)
        };

        $return =  new Promise(resolve => {
            setTimeout(() => {
                let $url = 'api/stores/'+$oldData.id;
                fetch($url)
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
                        //toaster.notify(error,{ position: "top-right"});
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
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/json',
            },
            body: JSON.stringify(newData)
        };

        $return = new Promise(resolve => {
            setTimeout(() => {
                let $url = "api/stores/"+oldData.id;
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(!result.success){

                        }
                        console.log(result);
                        resolve();
                    })
                    .catch(error => {
                        //toaster.notify(error,{ position: "top-right"});
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
                        onRowAdd: newData => this.add(newData),
                        onRowUpdate: (newData, oldData) => this.edit(newData,oldData),
                        onRowDelete: oldData => this.delete(oldData)
                    }}
                />
            </div>
        );
    }
}

//ReactDOM.render(<MaterialTableNewDemo />, document.querySelector('#Table'));
