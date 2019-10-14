import createStore from 'react-waterfall'

const fetchBlocks = (rack) => {
  return new Promise((resolve, reject) => {                                    
    let url = process.env.REACT_APP_API_LOCATION+'/warehouselocations/getblocks?warehouse_id=1&rack='+rack
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
    }

    url += '&per_page=15'
    url += '&order=asc'
    url += '&column=id'
    url += '&page=1'
    fetch(url, {            
      headers: headers,
    })
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
  })
}

const fetchItemsInBlock = (block) => {
  return new Promise((resolve, reject) => {                                    
    let url = process.env.REACT_APP_API_LOCATION+'/locationvariation/getitemsinlocation?warehouse_id=1&mapped_string='+block
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
    }

    url += '&per_page=15'
    url += '&order=asc'
    url += '&column=id'
    url += '&page=1'
    fetch(url, {            
      headers: headers,
    })
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
  })
}

const fetchInventory = (store) => {
  return new Promise((resolve, reject) => {                                    
    let url = process.env.REACT_APP_API_LOCATION+'/locationvariation/getall?warehouse_id=1'
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+process.env.REACT_APP_API_TOKEN,
    }

    url += '?per_page=15'
    url += '&order=asc'
    url += '&column=id'
    url += '&page=1'
    fetch(url, {            
      headers: headers,
    })
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
  })
}

const config = {
  initialState: {
    blocks: {
      loading: false,
    },
    itemsInBlock: {
      loading: false,
    },
    inventory: {
      loading: false,
    },
  },
  actionsCreators: {
    getBlocks: async (_, actions, rack) => {      
      const data = await fetchBlocks(rack)
      return { blocks: { loading: false, data: data } }
    },
    getItemsInBlock: async (_, actions, block) => {      
      const data = await fetchItemsInBlock(block)      
      return { itemsInBlock: { loading: false, data: data } }
    },
    getInventory: async (_, actions) => {      
      const data = await fetchInventory()      
      return { itemsInBlock: { loading: false, data: data } }
    },
  },
}

export const { Provider, connect, actions } = createStore(config)
