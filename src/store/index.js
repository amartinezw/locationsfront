import createStore from 'react-waterfall';
import * as overlay from '../components/loader'

const fetchBlocks = (rack, urlBlocks) => {
    let promise = new Promise((resolve, reject) => {
        let url = urlBlocks+'&rack='+rack;
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+localStorage.getItem('token'),
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
                overlay.hideLoader();
                resolve(result);
            })
    });
  return promise;
}

const fetchItemsInBlock = (block, withZeros) => {
  return new Promise((resolve, reject) => {
    let url = process.env.REACT_APP_API_LOCATION+'/locationvariation/getitemsinlocation?warehouse_id=1&mapped_string='+block
    if (withZeros) {
      url += '&withzeros=true';
    }                 
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+localStorage.getItem('token'),
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
          overlay.hideLoader();
          resolve(result)
      })
  })
}

const fetchInventory = (filters) => {
  return new Promise((resolve, reject) => {
    let url = process.env.REACT_APP_API_LOCATION+'/locationvariation/getall'
    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+localStorage.getItem('token'),
    }

    url += '?per_page=15'
    url += '&order=asc'
    url += '&column=id'
    url += '&page=1'
    if (filters.length > 0) {
      filters.map(filter => {
        url += '&'+filter.name+'='+filter.value
      })
    }

    fetch(url, {            
      headers: headers,
    })
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
  })
}

const fetchRoles = () => {
    return new Promise((resolve, reject) => {
        let url = process.env.REACT_APP_API_LOCATION+'/roles/getall'
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+localStorage.getItem('token'),
        }
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
    token: {
      access_token: '',
    },
    blocks: {
      loading: false,
    },
    itemsInBlock: {
      loading: false,
    },
    inventory: {
      loading: false,
    },
    roles: {
        loading: false,
    },
    withZeros: false,
  },
  actionsCreators: {
    getBlocks: async (_, actions, rack, url) => {
      const data = await fetchBlocks(rack, url);
      return { blocks: { loading: false, data: data } }
    },
    setToken: async (_, actions, token) => {
      return { token: { access_token: token } }
    },
    setWithZeros: (_, actions, withZeros) => {      
      return { withZeros: withZeros }
    },
    getItemsInBlock: async (_, actions, block, withZeros) => {      
      const data = await fetchItemsInBlock(block, withZeros)      
      return { itemsInBlock: { loading: false, data: data } }
    },
    clearItemsInBlock: async (_, actions) => {            
      return { itemsInBlock: { loading: false, data: null } }
    },
    getInventory: async (_, actions, filters) => {
      const data = await fetchInventory(filters)
      return { itemsInBlock: { loading: false, data: data } }
    },
    getRoles: async (_, actions) => {
        const data = await fetchRoles()
        return { roles: { loading: false, data: data } }
    },
  },
}

export const { Provider, connect, actions } = createStore(config)
