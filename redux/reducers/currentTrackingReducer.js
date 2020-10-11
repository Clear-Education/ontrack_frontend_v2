import * as types from "../types";


var initialTrackingState = {
    alumnos: [],
    anio_lectivo: '',
    descripcion: '',
    en_progreso: '',
    fecha_cierre: '',
    fecha_creacion: '',
    fecha_inicio: '',
    id: '',
    integrantes: [],
    materias: [],
    nombre: '',
    promedio: '',
    asistencia: '',
    cualitativos: [],
    current_step: 0,
};


const currentTrackingReducer = (state = initialTrackingState, action) => {
    switch (action.type) {
        case types.SAVE_CURRENT_TRACKING_DATA:
            return {
                ...state,
                alumnos: action.payload.alumnos,
                anio_lectivo: action.payload.anio_lectivo,
                descripcion: action.payload.descripcion,
                en_progreso:  action.payload.en_progreso,
                fecha_cierre: action.payload.fecha_cierre,
                fecha_creacion: action.payload.fecha_creacion,
                fecha_inicio: action.payload.fecha_inicio,
                id: action.payload.id,
                integrantes: action.payload.integrantes,
                materias: action.payload.materias,
                nombre: action.payload.nombre,
                promedio: action.payload.promedio,
                asistencia: action.payload.asistencia,
                cualitativos: action.payload.cualitativos,
                current_step: action.payload.current_step,

            }
        case types.RESET_CURRENT_TRACKING_DATA:
            return initialTrackingState;
        default:
            return state;
    }
};

export default currentTrackingReducer;