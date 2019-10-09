import authHeader from '../helpers/auth-header.js';
import React from "react";

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
            'Authorization': 'Bearer '+process.env.REACT_APP_API_TOKEN
        },
        body: JSON.stringify({
            'email' : username,
            'password' : password }),
    };
    return fetch(process.env.REACT_APP_API_LOCATION+"/user/authenticate", requestOptions)
        .then(handleResponse)
        .then(result => {
            if (result.status === "success") {
                result.user = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(result));
                return result;
            }

        })
}

function addUser(name, email, password, address) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+process.env.REACT_APP_API_TOKEN
        },
        body: JSON.stringify({
            'name'      : name,
            'email'     : email,
            'password'  : password,
            'address'   : address }),
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
            'Authorization': 'Bearer '+process.env.REACT_APP_API_TOKEN
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
            'Authorization': 'Bearer '+process.env.REACT_APP_API_TOKEN
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