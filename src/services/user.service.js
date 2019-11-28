import { actions } from 'store';

const userService = {
    login,
    logout,
    addUser,
    getAll,
    delUsusario
};

/**
 *
 * @param username
 * @param password
 * @returns {Promise<Response | never>}
 */
function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        },
        body: JSON.stringify({
            'grant_type': 'password',
            'client_id': 2,
            'client_secret': 'avVHCSJ6PQ9gJ5Uylw2xVTzR4qZbSlDfTxU44UaC',
            'username' : username,
            'password' : password,
             }),
    };
    return fetch(process.env.REACT_APP_BASE_LOCATION+"/oauth/token", requestOptions)
        .then(handleResponse)
        .then(result => {            
            localStorage.setItem('token', result.access_token);            
            return result;        
        })
}

function addUser(name, email, password, address, rol) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('token')
        },
        body: JSON.stringify({
            'name'      : name,
            'email'     : email,
            'password'  : password,
            'address'   : address,
            'rol'       : rol
        }),
    };
    return fetch(process.env.REACT_APP_API_LOCATION+"/user/create", requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result.status === "success") {
                console.log(result);
                return result;
            }
        })
}

/**
 * logout de usuario
 */
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

/**
 *
 * @returns {Promise<Response | never>}
 */
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('token'),
        },
    };

    return fetch(process.env.REACT_APP_API_LOCATION+"/user/getusers", requestOptions).then(handleResponse);
}

function delUsusario(id) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }
    };
    return fetch(process.env.REACT_APP_API_LOCATION+"/user/delete/"+id, requestOptions)
        .then(result => {
            console.log(result);
            if (result.status === "success") {
                return result;
            }
        })
}

/**
 *
 * @param response
 * @returns {*}
 */
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 404) {
                logout();
                const error =  data.message;
                return Promise.reject(error);
            }
            if (response.status === 422) {
                const error =  data.message;
                return Promise.reject(error);
            }
        }
        return data;
    });
}

export default userService;