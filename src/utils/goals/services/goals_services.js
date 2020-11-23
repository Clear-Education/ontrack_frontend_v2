import { getGoalsCrud, addGoalsCrud, editGoalsCrud, deleteGoalsCrud, getGoalsTypeCrud, addMultipleGoalsCrud, getStudentGoalsCrud, getTrackingGoalsCrud, getGoalsProgressionStudent, editGoalsState } from "../cruds/goals_cruds";
import Alert from "react-s-alert";
import { parseGoalsData } from "./goals_functions_services";


export async function getTrackingGoalsService(token, tracking_id) {
    return await getTrackingGoalsCrud(token, tracking_id).then((result) => {
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


export async function getGoalsTypeService(token) {
    return await getGoalsTypeCrud(token).then((result) => {
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


export async function getStudentGoalsService(token, student_id, seguimiento_id) {
    return await getStudentGoalsCrud(token, student_id, seguimiento_id).then((result) => {
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


export async function addGoalsService(data, token) {
    return await addGoalsCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Objetivo creado correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al agregar el objetivo", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function addMultipleGoalsService(data, token, editing) {
    return await getGoalsTypeService(token).then((result) => {
        const GOALS_DATA = parseGoalsData(data, result.result);
        return addMultipleGoalsCrud(GOALS_DATA, token).then((result) => {
            if (result.success) {
                let msg = editing ? "Objetivo creado correctamente" : "Seguimiento creado correctamente";
                Alert.success(msg, {
                    effect: "stackslide",
                });
            } else {
                let msg = editing ? "Ocurrió un error al crear el objetivo" : "Ocurrió un error al crear el seguimiento";
                Alert.error(msg, {
                    effect: "stackslide",
                });
            }
            return result;
        })
    });
}

export async function editGoalsService(data, token) {
    return await editGoalsCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Objetivo modificado correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al editar el objetivo", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function deleteGoalsService(token, data) {
    return await deleteGoalsCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Objetivo eliminado correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al eliminar el objetivo", {
                effect: "stackslide",
            });
        }
        return result;
    })
}

export async function getGoalsProgressionStudentService(token, data, date_filter = null) {
    return await getGoalsProgressionStudent(token, data, date_filter).then((result) => {
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

export async function editGoalsStateService(data, token) {
    return await editGoalsState(data, token).then((result) => {
        if (result.success) {
            Alert.success("Estado del objetivo modificado correctamente", {
                effect: "stackslide",
            });
        } else {
            Alert.error("Ocurrió un error al editar el estado del objetivo", {
                effect: "stackslide",
            });
        }
        return result;
    })
}
