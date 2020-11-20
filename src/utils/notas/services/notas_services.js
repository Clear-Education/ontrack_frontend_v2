import { getNotasCrud, getNotasCursoCrud, addNotasCrud, editNotasCrud, deleteNotasCrud, addNotasMultipleCrud } from "../cruds/notas_cruds";
import Alert from "react-s-alert";


export async function getNotasService(token) {
    return await getNotasCrud(token).then((result) => {
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

export async function getNotasCursoService(token, id_curso, id_evaluacion) {
    return await getNotasCursoCrud(token, id_curso, id_evaluacion).then((result) => {
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

export async function addNotasService(token, data) {
    return await addNotasCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Calificación cargada correctamente", {
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

export async function addNotasMultipleService(token, data) {
    return await addNotasMultipleCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Calificación cargada correctamente", {
                effect: "stackslide",
            });
        } else {
            let msg = !!result.data.calificaciones?.length ?
                'Asegúrese de que los valores ingresados en "puntaje" son de 0 a 10'
                : 'Ocurrió un error inesperado, pruebe cargando desde la plantilla'

            Alert.error(msg, {
                effect: "stackslide",
            });

        }
        return result;
    })
}

export async function editNotasService(token, data) {
    return await editNotasCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Calificación modificada correctamente", {
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


export async function deleteNotasService(token, data) {
    return await deleteNotasCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Calificación eliminada correctamente", {
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
