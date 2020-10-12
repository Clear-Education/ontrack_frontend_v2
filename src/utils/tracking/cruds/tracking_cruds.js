import config from '../../config';
import axios from 'axios';
import errorHandler from "../../error_handler";

export async function addTrackingCrud(data, auth_token) {
    return axios.post(`${config.api_url}/seguimientos/`, data, {
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

export async function getTrackingCrud(auth_token, _id) {
    const URL = _id ? `${config.api_url}/seguimientos/${_id}/` : `${config.api_url}/seguimientos/list/`
    return axios
        .get(URL, {
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

export async function getAllTrackings(auth_token) {
    return axios
        .get(`${config.api_url}/seguimientos/list/`, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
            params: { cerrado: true }
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

export async function getTrackingRolesCrud(auth_token) {
    return axios
        .get(`${config.api_url}/seguimientos/rol/list/`, {
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

export async function editTrackingCrud(data, auth_token) {
    const DATA = {
        id: data.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        fecha_cierre: data.fecha_cierre
    }
    return axios
        .patch(`${config.api_url}/seguimientos/${DATA.id}/`, DATA, {
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


export async function deleteTrackingCrud(data, auth_token) {
    return axios.delete(`${config.api_url}/${data.id}/`, {
        headers: {
            Authorization: `Token ${auth_token}`,
        },
    })
        .then((result) => {
            return result;
        }).catch((error) => {
            return errorHandler(error);
        });
}


export async function checkExistingTrackingNameCrud(token, trackingName) {
    const DATA = {
        nombre: trackingName
    }
    return axios.post(`${config.api_url}/seguimientos/unique/`, DATA, {
        headers: {
            Authorization: `Token ${token}`,
        }
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

export async function changeTrackingStatusCrud(token, data) {
    const DATA = {
        en_progreso: data.status
    }
    return axios.patch(`${config.api_url}/seguimientos/${data.id}/status/`, DATA, {
        headers: {
            Authorization: `Token ${token}`,
        }
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



export async function editTrackingParticipantsCrud(data, token) {
    const seguimiento_id = data[0].seguimiento;
    return axios.patch(`${config.api_url}/seguimientos/${seguimiento_id}/integrantes/`, data, {
        headers: {
            Authorization: `Token ${token}`,
        }
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