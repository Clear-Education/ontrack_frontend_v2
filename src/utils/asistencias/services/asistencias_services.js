import { getAsistenciasCrud, addAsistenciasCrud, addMultipleAsistenciasCrud, editAsistenciasCrud, deleteAsistenciasCrud, getAsistencias2Crud } from "../cruds/asistencias_cruds";
import Alert from "react-s-alert";


export async function getAsistenciasService(token, curso_id, alumno_id, dates) {
    return await getAsistenciasCrud(token, curso_id, alumno_id, dates).then((result) => {
        if (result.success) {

        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}

export async function getAsistencias2Service(token, curso_id, date) {
    return await getAsistencias2Crud(token, curso_id, date).then((result) => {
        if (result.success) {

        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}


export async function addAsistenciasService(data, token) {
    return await addAsistenciasCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Asistencia creada correctamente", {
                effect: "stackslide",
            });
        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}

export async function addMultipleAsistenciasService(data, token) {
    return await addMultipleAsistenciasCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Asistencias cargadas correctamente", {
                effect: "stackslide",
            });
        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}

export async function editAsistenciasService(token, data) {
    return await editAsistenciasCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Asistencia editada correctamente", {
                effect: "stackslide",
            });
        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}


export async function deleteAsistenciasService(token, data) {
    return await deleteAsistenciasCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Asistencia eliminada correctamente", {
                effect: "stackslide",
            });
        } else {
            result.result.forEach((element) => {
                Alert.error(element.message, {
                    effect: "stackslide",
                });
            });
        }
        return result;
    })
}
