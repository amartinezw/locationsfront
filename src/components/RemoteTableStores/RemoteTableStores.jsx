import React from 'react';
import MaterialTable from 'material-table';
import ReactDOM from "react-dom";

export default class RemoteTableStores extends React.Component{

    constructor (props){
        super(props);
        this.serverApi = "http://ec2-34-219-142-13.us-west-2.compute.amazonaws.com/";
        this.methods = {
            show    : this.serverApi+'api/v1/warehouses/getall?',
            add     : this.serverApi+'api/v1/warehouses/store?',
            delete  : this.serverApi+'api/v1/warehouses/destroy?',
            edit    : this.serverApi+'api/v1/warehouses/update?'
        }
        this.query = "";
        this.state = {
            columns: [
                { title: 'ID Tienda',field : "store.id", type: "numeric" },
                { title: 'Num. Tienda', field: 'store.number', type: 'numeric',editable: 'never'},
                { title: 'Nombre de la tienda', field: 'store.name',editable: 'never' },
                { title: 'Num. Bodega (DB)', field: 'id', type: 'numeric' ,editable: 'never'},
                { title: 'Nombre de la bodega', field: 'name'},
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
                let $url = this.methods.add+'store_id='+$newData.store.id;
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
        $oldData['per_page']= this.query.totalCount;
        console.log($oldData);

        let $params = {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify($oldData)
        };

        $return =  new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.delete+'warehouse_id='+$oldData.id;
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
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(newData)
        };

        $return = new Promise(resolve => {
            setTimeout(() => {
                let $url = this.methods.edit+"warehouse_id="+oldData.id+"&name="+newData.name+"&store_id="+newData.store.id;
                //resolve();
                fetch($url,$params)
                    .then(response => response.json())
                    .then(result => {
                        if(!result.success){

                        }
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

                    options={{
                        pageSize: 10
                    }}
                />
            </div>
        );
    }
}

//ReactDOM.render(<MaterialTableNewDemo />, document.querySelector('#Table'));
