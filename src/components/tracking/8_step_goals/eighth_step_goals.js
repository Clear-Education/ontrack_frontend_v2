import FormLabel from '@material-ui/core/FormLabel';
import { Row, Col } from "react-bootstrap";
import styles from '../tracking.module.scss'
import localStyles from './styles.module.scss'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FormControl, FormHelperText, IconButton, OutlinedInput, InputAdornment } from '@material-ui/core';
import AddItemList from '../../commons/add_item_list/add_item_list';
import OnlineAddItemList from '../../commons/online_add_item_list/online_add_item_list';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import { deleteGoalsService, editGoalsService, addGoalsService, getGoalsTypeService } from '../../../utils/goals/services/goals_services';


const INITIAL_STATE = {
    promedio: '',
    asistencia: '',
    cualitativos: []
}

const VALIDATE_INITIAL_STATE = {
    promedio: false,
    asistencia: false,
};



const EighthStepGoals = ({ handleGlobalState, editable, handleEdit }) => {

    const [state, setState] = useState(INITIAL_STATE);
    const [validation, setValidation] = useState(VALIDATE_INITIAL_STATE);
    const [disabledAsistencia, setDisabledAsistencia] = useState();
    const [disabledPromedio, setDisabledPromedio] = useState();
    const [disabledCualitativos, setDisabledCualitativos] = useState();
    const [qualitativeType, setQualitativeType] = useState();
    const [isLoading,setIsLoading] = useState(true);
    const trackingData = useSelector((store) => store.tracking);
    const user = useSelector((store) => store.user);


    useEffect(() => {
        if (editable) {
            getGoalsTypeService(user.user.token).then((result) => {
                const QUALITATIVE_TYPE = result.result.find((type) => type.nombre === 'cualitativo')
                setQualitativeType(QUALITATIVE_TYPE);
            })
        }
    }, [editable])

    useEffect(() => {
        setDisabledAsistencia(editable);
        setDisabledPromedio(editable);
        setDisabledCualitativos(editable)
    }, [])

    useEffect(() => {
        setState({
            ...state,
            promedio: trackingData.promedio,
            asistencia: trackingData.asistencia,
            cualitativos: trackingData.cualitativos
        })
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);
    }, [])

    const handleEditAsistencia = () => {
        if (!disabledAsistencia) {
            editGoalsService(trackingData.asistencia, user.user.token).then((result) => {
                if (result.success) {
                    setDisabledAsistencia(!disabledAsistencia)
                }
            })
        } else {
            setDisabledAsistencia(!disabledAsistencia)
        }
    }

    const handleEditPromedio = () => {
        if (!disabledPromedio) {
            editGoalsService(trackingData.promedio, user.user.token).then((result) => {
                if (result.success) {
                    setDisabledPromedio(!disabledPromedio)
                }
            })
        } else {
            setDisabledPromedio(!disabledPromedio)
        }
    }

    const handleEditCualitativos = () => {
        setDisabledCualitativos(!disabledCualitativos)
    }

    const handleSaveGoal = (type) => {
        switch (type) {
            case 'promedio':
                handleEditPromedio();
                break;
            case 'asistencia':
                handleEditAsistencia();
                break;
            case 'cualitativos':
                handleEditCualitativos();
                break;

            default:
                break;
        }
    }


    const hadleValidation = (prop, value) => {
        if (prop === "promedio") {
            let puntaje = parseInt(value, 10)
            if (puntaje >= 0 && puntaje <= 10) {
                setValidation({
                    ...validation,
                    [prop]: false
                })
            } else {
                setValidation({
                    ...validation,
                    [prop]: true
                })
            }
        } else {
            setValidation({
                ...validation,
                [prop]: !(value > 0 && value <= 100),
            });
        }
    };



    const handleChange = (prop) => (event) => {
        let value = event.target.value
        hadleValidation(prop, value);
        if (!editable) {
            setState({ ...state, [prop]: value })
            handleGlobalState && handleGlobalState(prop, value);
        } else {
            let data = {
                id: event.target.id,
                value: value
            }
            setState({ ...state, [prop]: data });
            handleEdit && handleEdit(prop, data)
        }
    }

    async function handleOnlineQualitativeGoals(type, data) {
        switch (type) {
            case 'delete':
                const DELETE_DATA = {
                    id: data
                }
                return deleteGoalsService(user.user.token, DELETE_DATA).then((result) => {
                    return result;
                })
            case 'add':

                const ADD_DATA = {
                    descripcion: data,
                    seguimiento: trackingData.id,
                    tipo_objetivo: qualitativeType.id
                }
                return addGoalsService(user.user.token, ADD_DATA).then((result) => {
                    if (result.success) {
                        const newData =
                        {
                            id: result.result.id,
                            descripcion: data
                        }
                        setState({ ...state, ['cualitativos']: newData });
                        handleEdit && handleEdit('cualitativos', newData)
                    }
                    return result;
                })

            default:
                break;
        }
    }
    const handleQualitativeGoals = (qualitativeItems) => {
        handleGlobalState && handleGlobalState("cualitativos", qualitativeItems);
    }

    return (
        isLoading ? 'Cargando...' : 
        <>
            <div className={styles.container}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h6 className="left" className={localStyles.goals_title}>Métricas:</h6>
                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.input_container}`}>

                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container} style={{ marginLeft: '-10px' }}>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                    <FormControl variant="outlined">
                                        <FormLabel className="left" component="legend">Promedio: (No requerido)</FormLabel>
                                        <OutlinedInput
                                            disabled={disabledPromedio}
                                            id={state.promedio.id ? state.promedio.id : 'promedio'}
                                            name="promedio"
                                            variant="outlined"
                                            value={state.promedio.value ? state.promedio.value : state.promedio}
                                            onChange={handleChange("promedio")}
                                            type="number"
                                            inputProps={{ min: "0", max: "10", step: "1" }}
                                            required
                                            style={{
                                                padding: '5px'
                                            }}
                                            endAdornment={
                                                editable &&
                                                <InputAdornment position="end">
                                                    <IconButton onClick={disabledPromedio ? handleEditPromedio : () => handleSaveGoal('promedio')}>
                                                        {disabledPromedio ? <EditIcon /> : <DoneIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    {validation.promedio && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            La calificación del alumno debe ser un número comprendido entre 0 y 10.
                                        </FormHelperText>
                                    )}
                                </Col>

                                <Col lg={6} md={6} sm={6} xs={6}>
                                    <FormControl variant="outlined">
                                        <FormLabel className="left" component="legend">Asistencia %:  (No requerido)</FormLabel>
                                        <OutlinedInput
                                            disabled={disabledAsistencia}
                                            id={state.asistencia.id ? state.asistencia.id : 'asistencia'}
                                            name="asistencia"
                                            variant="outlined"
                                            value={state.asistencia.value ? state.asistencia.value : state.asistencia}
                                            onChange={handleChange("asistencia")}
                                            type="number"
                                            required
                                            style={{
                                                padding: '5px'
                                            }}
                                            endAdornment={
                                                editable &&
                                                <InputAdornment position="end">
                                                    <IconButton onClick={disabledAsistencia ? handleEditAsistencia : () => handleSaveGoal('asistencia')}>
                                                        {disabledAsistencia ? <EditIcon /> : <DoneIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    {validation.asistencia && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            La asistencia debe ser un valor de 1 a 100 (%).
                                        </FormHelperText>
                                    )}
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </motion.div>
            </div>
            <div className={styles.container}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={localStyles.goals_header}>
                        <h6 className="left" className={localStyles.goals_title}>Objetivos:</h6>
                        {editable ?
                            <IconButton onClick={disabledCualitativos ? handleEditCualitativos : () => handleSaveGoal('cualitativos')}>
                                {disabledCualitativos ? <EditIcon /> : <DoneIcon />}
                            </IconButton>

                            : null
                        }
                    </div>

                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.input_container}`}>
                            {editable ?
                                <OnlineAddItemList
                                    labelText={"Añade un objetivo"}
                                    handleList={handleOnlineQualitativeGoals}
                                    previousItems={trackingData.cualitativos}
                                    editable={disabledCualitativos}
                                /> :
                                <AddItemList
                                    labelText={"Añade un objetivo"}
                                    handleList={handleQualitativeGoals}
                                    previousItems={trackingData.cualitativos}
                                    editable={disabledCualitativos}
                                />
                            }
                        </Col>
                    </Row>
                </motion.div>
            </div>
        </>
    )
}


export default EighthStepGoals;