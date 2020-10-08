import { getGoalsCrud, addGoalsCrud, editGoalsCrud, deleteGoalsCrud, getGoalsTypeCrud, addMultipleGoalsCrud, getStudentGoalsCrud, getTrackingGoalsCrud, getGoalsProgressionStudent } from "../cruds/goals_cruds";
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


export async function addMultipleGoalsService(data, token) {
    return await getGoalsTypeService(token).then((result) => {
        const GOALS_DATA = parseGoalsData(data, result.result);
        return addMultipleGoalsCrud(GOALS_DATA, token).then((result) => {
            if (result.success) {
                Alert.success("Seguimiento creado correctamente", {
                    effect: "stackslide",
                });
            } else {
                Alert.error("Ocurrió un error al crear el seguimiento", {
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

export async function getGoalsProgressionStudentService(token, data) {
    return await getGoalsProgressionStudent(token, data).then((result) => {
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