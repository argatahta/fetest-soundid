import axios from "axios";

import { LOGIN_ENDPOINT, baseUrl } from "./endpoints";

const serverLogin = (username, password) => new Promise((resolve, reject) => {
    const body = {
        username,
        password
    }
    return axios.post(`${LOGIN_ENDPOINT}`, body, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'onesound.id'
        },
    })
        .then(response => {
            const result = response.data
            resolve({
                meta: {
                    status: "success",
                    error: '',
                },
                data: result || [],
            })
        })
        .catch(error => {
            const errorData = error?.response?.data ?? {}
            reject(errorData)
        })
});

const userLogin = (username, password) => new Promise((resolve, reject) => {
    return axios.get(`/api/login?username=${username}&password=${password}`, {
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            console.log({ response })
            const result = response.data
            resolve({
                meta: {
                    status: "success",
                    error: '',
                },
                data: result || [],
            })
        })
        .catch(error => {
            const errorData = error?.response?.data ?? {}
            reject(errorData)
        })
});

const getContacts = (token) => new Promise((resolve, reject) => {
    return axios.get(`${baseUrl}`, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
    })
        .then(response => {
            const result = response?.data?.data
            resolve({
                meta: {
                    status: "success",
                    error: '',
                },
                data: result || [],
            })
        })
        .catch(error => {
            const errorData = error?.response?.data ?? {}
            reject(errorData)
        })
});

export default {
    userLogin,
    serverLogin,
    getContacts
}