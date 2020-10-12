import { getTrackingCrud, addTrackingCrud, editTrackingCrud, deleteTrackingCrud, getTrackingRolesCrud, checkExistingTrackingNameCrud, changeTrackingStatusCrud, editTrackingParticipantsCrud, getAllTrackings } from "../cruds/tracking_cruds";
import Alert from "react-s-alert";
import { parseTrackingData } from "./tracking_functions_services";
import { addMultipleGoalsService } from "../../goals/services/goals_services";


export async function getTrackingService(token, _id) {
    return await getTrackingCrud(token, _id).then((result) => {
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


export async function getAllTrackingService(token) {
    return await getAllTrackings(token).then((result) => {
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

export async function getTrackingRolesService(token) {
    return await getTrackingRolesCrud(token).then((result) => {
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


export async function addTrackingService(data, token) {
    const TRACKING_DATA = parseTrackingData(data);
    return await addTrackingCrud(TRACKING_DATA, token).then((result) => {
        if (result.success) {
            Alert.success("Seguimiento creado correctamente, defina los objetivos!", {
                effect: "stackslide",
            });

        } else {
            Alert.error("Ocurrió un error al crear el seguimiento", {
                effect: "stackslide",
            });
        }
        return result;
    })
}

export async function editTrackingService(data, token) {
    return await editTrackingCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Seguimiento editado correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al editar el seguimiento", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function deleteTrackingService(token, data) {
    return await deleteTrackingCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Materia eliminada correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al eliminar la materia", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function checkExistingTrackingNameServie(token, trackingName) {
    return await checkExistingTrackingNameCrud(token, trackingName).then((result) => {
        if (result.success) {

        } else {
            Alert.error("Ya existe un seguimiento con el nombre elegido, prueba uno diferente!", {
                effect: "stackslide",
            });
        }
        return result;
    })
}



export async function changeTrackingStatusService(token, data) {
    return await changeTrackingStatusCrud(token, data).then((result) => {
        if (result.success) {
            let message = `Seguimiento ${!data.status ? 'finalizado' : 'activado'} correctamente`
            Alert.success(message, {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al finalizar el seguimiento", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function editTrackingParticipants(data, token) {
    return await editTrackingParticipantsCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Participantes editados correctamente", {
                effect: "stackslide",
            });
        } else {
            let errorMsg = result.result[0]?.message[0];
            let msg = errorMsg ? errorMsg : "Ocurrió un error al editar los participantes";
            Alert.error(msg, {
                effect: "stackslide",
            });

        }
        return result;
    })
}
