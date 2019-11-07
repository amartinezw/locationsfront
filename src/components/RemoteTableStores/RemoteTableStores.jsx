import React from 'react';
import MaterialTable from 'material-table';
import materialTableLocaleES from '../MaterialTableLocaleES';

export default class RemoteTableStores extends React.Component{

    constructor (props){
        super(props);
        this.methods = {
            show    : process.env.REACT_APP_API_LOCATION+'/warehouses/getall?',
            add     : process.env.REACT_APP_API_LOCATION+'/warehouses/store?',
            delete  : process.env.REACT_APP_API_LOCATION+'/warehouses/destroy?',
            edit    : process.env.REACT_APP_API_LOCATION+'/warehouses/update?'
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
            "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,//this.props.key_,
        }
    }

    show($query){
        this.query = $query;
        let $return;
        $return = new Promise((resolve, reject) => {
            console.log($query);
            let $url = this.methods.show;
            $url += "per_page="+this.query.pageSize+"&page="+(this.query.page+1);
            if(!$query.search=="")
                $url +="&q="+$query.search;

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
                            //let text = result.error.code;
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
                    localization={materialTableLocaleES}
                    editable={{
                        onRowAdd: newData => this.add(newData),
                        onRowUpdate: (newData, oldData) => this.edit(newData,oldData),
                        onRowDelete: oldData => this.delete(oldData)
                    }}

                    options={{
                        pageSize: 10,
                        debounceInterval: 700,
                    }}
                />
            </div>
        );
    }
}

//ReactDOM.render(<MaterialTableNewDemo />, document.querySelector('#Table'));
