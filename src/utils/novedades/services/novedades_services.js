import { getNovedadesCrud, addNovedadesCrud, editNovedadesCrud, deleteNovedadesCrud, addNovedadesFileCrud, getMoreNovedadesCrud } from "../cruds/novedades_cruds";
import Alert from "react-s-alert";


export async function getNovedadesService(token, seguimiento_id) {
    return await getNovedadesCrud(token, seguimiento_id).then((result) => {
        if (result.success) {

        } else {
            Alert.error("Ocurrió un error al buscar las novedades", {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function getMoreNovedadesService(token, url) {
    return await getMoreNovedadesCrud(token, url).then((result) => {
        if (result.success) {

        } else {
            Alert.error("Ocurrió un error al buscar las novedades", {
                effect: "stackslide",
            });
        }
        return result;
    })
}

export async function addNovedadesService(data, token) {
    return await addNovedadesCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Novedades creado correctamente", {
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

export async function addNovedadesFileService(data, token) {

    return await addNovedadesFileCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Novedades creado correctamente", {
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


export async function editNovedadesService(data, token) {
    return await editNovedadesCrud(data, token).then((result) => {
        if (result.success) {
            Alert.success("Novedad editada correctamente", {
                effect: "stackslide",
            });
        } else {
            let message = result.result[0].message || 'Ocurrió un error al eliminar la novedad';
            Alert.error(message, {
                effect: "stackslide",
            });
        }
        return result;
    })
}


export async function deleteNovedadesService(token, data) {
    return await deleteNovedadesCrud(token, data).then((result) => {
        if (result.success) {
            Alert.success("Novedad eliminada correctamente", {
                effect: "stackslide",
            });
        } else {
            let message = result.result[0].message || 'Ocurrió un error al eliminar la novedad';
            Alert.error(message, {
                effect: "stackslide",
            });
        }
        return result;
    })
}
