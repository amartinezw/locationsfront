import authHeader from '../helpers/auth-header.js';
import React from "react";

const userService = {
    login,
    logout,
    getAll
};

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
    return fetch("http://localhost:8000/api/v1/user/authenticate", requestOptions)
        .then(handleResponse)
        .then(result => {
            // login successful if there's a user in the response
            if (result.code === 200) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
                result.user = window.btoa(username + ':' + password);
                localStorage.setItem('user', JSON.stringify(result));
            }
            return result;
        }).catch(function(error) {
            console.log('Hubo un problema con la petición de autenticación:' + error.message);
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch("http://localhost:8000/api/v1/user/getusers", requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

export default userService;