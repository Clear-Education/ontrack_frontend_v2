import config from '../../config';
import axios from 'axios';
import errorHandler from "../../error_handler";

export async function addGoalsCrud(auth_token, data) {
    return axios.post(`${config.api_url}/objetivos/`, data, {
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

export async function addMultipleGoalsCrud(data, auth_token) {
    return axios.post(`${config.api_url}/objetivos/multiple/`, data, {
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

export async function getTrackingGoalsCrud(auth_token, tracking_id) {
    return axios
        .get(`${config.api_url}/objetivos/list/seguimiento/${tracking_id}/`, {
            headers: {
                Authorization: `Token ${auth_token}`,
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

export async function getStudentGoalsCrud(auth_token, student_id, seguimiento_id) {
    return axios
        .get(`${config.api_url}/objetivos/alumno/${student_id}/`, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
            params: {
                seguimiento: seguimiento_id
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


export async function getGoalsTypeCrud(auth_token) {
    return axios
        .get(`${config.api_url}/objetivos/tipo/list/`, {
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

export async function editGoalsCrud(data, auth_token) {

    const DATA = {
        id: data.id,
        valor_objetivo_cuantitativo: data.value,
    }
    return axios
        .patch(`${config.api_url}/objetivos/${DATA.id}/`, DATA, {
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


export async function deleteGoalsCrud(auth_token, data) {
    return axios.delete(`${config.api_url}/objetivos/${data.id}/`, {
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

export async function getGoalsProgressionStudent(auth_token, data, datefilter) {
    return axios
        .get(`${config.api_url}/objetivos/${data.id_objetivo}/alumno/${data.id_alumno}/`, {
            headers: {
                Authorization: `Token ${auth_token}`,
            },
            params: {
                fecha_desde: datefilter?.from,
                fecha_hasta: datefilter?.to
            }
        })
        .then(json => {
            let response = {
                success: true,
                result: json.data,
                status: json.status
            };

            return response;
        })
        .catch(error => errorHandler(error));
}

export async function editGoalsState(data, auth_token) {

    return axios
        .patch(`${config.api_url}/objetivos/${data.id}/alumno/`, data, {
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