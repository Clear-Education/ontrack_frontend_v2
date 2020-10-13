import config from '../../config';
import axios from 'axios';
import errorHandler from "../../error_handler";

export async function addNovedadesCrud(data, auth_token) {
    let parsedData = {
        cuerpo: data.cuerpo,
    }
    if (data.seguimiento_padre) parsedData.padre = data.seguimiento_padre;
    return axios.post(`${config.api_url}/actualizaciones/${data.seguimiento}/`, parsedData, {
        headers: {
            Authorization: `Token ${auth_token}`,
        }
    })
        .then((json) => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;

        })
        .catch((error) => {
            return errorHandler(error);
        });
}

export async function addNovedadesFileCrud(data, auth_token) {
    let formData = new FormData();
    formData.append("actualizacion", data.post);
    formData.append("files", data.files);
    return axios.post(`${config.api_url}/actualizaciones/${data.post}/files/`, formData, {
        headers: {
            Authorization: `Token ${auth_token}`,
            "Content-Type": "multipart/form-data",
        },
    })
        .then((json) => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;

        })
        .catch((error) => {
            return errorHandler(error);
        });
}

export async function getNovedadesCrud(auth_token, seguimiento_id) {
    return axios
        .get(`${config.api_url}/actualizaciones/${seguimiento_id}/list/`, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
            params: {
                limit: 10
            }

        })
        .then(json => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;
        })
        .catch(error => errorHandler(error));
}

export async function getMoreNovedadesCrud(auth_token, url) {
    return axios
        .get(url, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
        })
        .then(json => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;
        })
        .catch(error => errorHandler(error));
}

export async function editNovedadesCrud(data, auth_token) {

    return axios
        .patch(`${config.api_url}/actualizaciones/${data.id}/mix/`, data, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
        })
        .then((json) => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;

        })
        .catch((error) => {
            return errorHandler(error);
        });
}


export async function deleteNovedadesCrud(auth_token, novedad_id) {
    return axios.delete(`${config.api_url}/actualizaciones/${novedad_id}/mix/`, {
        headers: {
            Authorization: `Token ${auth_token}`,
        },
    })
        .then((json) => {
            let response = {
                success: true,
                result: json.data,
            };

            return response;

        }).catch((error) => {
            return errorHandler(error);
        });
}
