import styles from './styles.module.scss';
import { Row, Col } from "react-bootstrap";
import TitlePage from '../../../../../src/components/commons/title_page/title_page';
import SubMenu from '../../../../../src/components/commons/sub_menu/sub_menu';
import { useEffect, useState } from 'react';
import { changeTrackingStatusService, editTrackingService, getTrackingService } from '../../../../../src/utils/tracking/services/tracking_services';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ConfigTable from '../../../../../src/components/configuration/config_table/config_table';
import { Collapse, IconButton, Switch, TextField } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFilter from '../../../../../src/components/tracking/view/date_filter/date_filter';
import EighthStepGoals from '../../../../../src/components/tracking/8_step_goals/eighth_step_goals';
import { getTrackingGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import Modal from '../../../../../src/components/commons/modals/modal'
import Alert from "react-s-alert";

//REDUX TYPES
import * as types from "../../../../../redux/types";
import DeleteForm from '../../../../../src/components/commons/delete_form/deleteForm';
import Link from "next/link";


const Configuracion = () => {

    const router = useRouter();
    const user = useSelector((store) => store.user);
    const [trackingId, setTrackingId] = useState();
    const [goalsData, setGoalsData] = useState();
    const [trackingData, setTrackingData] = useState();
    const [trackingStatus, setTrackingStatus] = useState(true);
    const [firstSection, setFirstSection] = useState();
    const [secondSection, setSecondSection] = useState();
    const [thirdSection, setThirdSection] = useState();
    const [dangerZone, setDangerZone] = useState();
    const [editDates, setEditDates] = useState(true);
    const [editTitle, setEditTitle] = useState();
    const storedTrackingData = useSelector((store) => store.tracking);


    const dispatch = useDispatch();

    useEffect(() => {
        if (trackingId) {
            getTrackingService(user.user.token, trackingId).then((result) => {
                setTrackingData(result.result);
                setTrackingStatus(result.result.en_progreso)
            })
            getTrackingGoalsService(user.user.token, trackingId).then((result) => {
                setGoalsData(result.result);
            })
        }
    }, [trackingId])

    useEffect(()=>{
        if(goalsData){
            const GOALS = parseGoalsData();
            let payload = {
                ...storedTrackingData,
                promedio: '',
                asistencia: '',
                cualitativos: [],
            }
            payload.cualitativos = GOALS.cualitativos
            payload.promedio = GOALS.promedio,
            payload.asistencia = GOALS.asistencia
            dispatch({ type: types.SAVE_TRACKING_DATA, payload: payload });
        }
    
    },[goalsData])

    useEffect(() => {
        let payload = {
            ...storedTrackingData,
            id: '',
            nombre: '',
            descripcion: '',
            alumnos: [],
            materias: [],
            integrantes: [],
            fecha_desde: '',
            fecha_hasta: '',
        }
        if (trackingData) {
            const STUDENTS = parseStudentData();
            const SUBJECTS = parseSubjectData();
            const PARTICIPANTS = parseParticipantsData();
            payload.id = trackingData.id,
            payload.nombre = trackingData.nombre,
            payload.descripcion = trackingData.descripcion,
            payload.fecha_desde = trackingData.fecha_inicio,
            payload.fecha_hasta = trackingData.fecha_cierre,
            payload.materias = SUBJECTS,
            payload.alumnos = STUDENTS,
            payload.integrantes = PARTICIPANTS
        }
        dispatch({ type: types.SAVE_TRACKING_DATA, payload: payload });

    }, [trackingData]);

    const parseStudentData = () => {
        return trackingData.alumnos.map((student) => { return student.alumno });
    }

    const parseSubjectData = () => {
        const SUBJECTS_DATA = trackingData.materias;
        let newSubjectData = []
        SUBJECTS_DATA.map((subject) => {
            let newData = {
                department_name: subject.anio.carrera,
                subject_name: subject.nombre,
                year: subject.anio.nombre
            }
            newSubjectData.push(newData);
        });
        return newSubjectData;
    }


    const parseParticipantsData = () => {
        const PARTICIPANTS_DATA = trackingData.integrantes;
        let newParticipantsData = []
        PARTICIPANTS_DATA.map((participant) => {
            let newData = {
                id: participant.id,
                rol: participant.rol,
                nombre: participant.usuario.name,
                apellido: participant.usuario.last_name,
            }
            newParticipantsData.push(newData);
        });
        return newParticipantsData;
    }

    const parseGoalsData = () => {
        let goals = {
            promedio: {
                id: '',
                value: ''
            },
            asistencia: {
                id: '',
                value: ''
            },
            cualitativos: [],
        }
        goalsData && goalsData.map((goal) => {
            const GOAL_TYPE = (goal.tipo_objetivo.nombre).toUpperCase();
            if (GOAL_TYPE === 'PROMEDIO') {
                goals.promedio.id = goal.id,
                    goals.promedio.value = goal.valor_objetivo_cuantitativo
            }
            if (GOAL_TYPE === 'ASISTENCIA') {
                goals.asistencia.id = goal.id,
                    goals.asistencia.value = goal.valor_objetivo_cuantitativo
            }
            if (GOAL_TYPE === 'CUALITATIVO') {
                const DATA = {
                    id: goal.id,
                    descripcion: goal.descripcion
                }
                goals.cualitativos.push(DATA)
            }
        });

        return goals;
    }

    useEffect(() => {
        let params = Object.values(router.query);
        let id = params[0];
        setTrackingId(id);
    }, [router.query]);

    async function handleConfirmTrackingStatus() {
        const DATA = {
            id: trackingData.id,
            status: !trackingStatus
        }
        return changeTrackingStatusService(user.user.token, DATA).then((result) => {
            if (result.success) {
                setTrackingStatus(!trackingStatus);
            }
            return result;
        })

    }

    const convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
    }

    const convertDate2 = (date) => {
        let datearray = date.split("-");
        let newdate = datearray[2] + '/' + datearray[1] + '/' + datearray[0];
        return newdate;
    }

    const handleSaveDates = () => {
        if (!editDates) {
            const DATA = {
                id: trackingData.id,
                nombre: storedTrackingData.nombre,
                descripcion: storedTrackingData.descripcion,
                fecha_cierre: storedTrackingData.fecha_hasta == 'NaN-NaN-NaN' ? "10/10/1900" : convertDate2(storedTrackingData.fecha_hasta)
            }

            editTrackingService(DATA, user.user.token).then((result) => {
                if (result.success) {
                    setEditDates(!editDates);
                }
            });
        } else {
            setEditDates(!editDates);
        }
    }

    const handleDate = (date) => {
        let dateFormatted = convertDate(date);
        const DATA = {
            ...storedTrackingData,
            fecha_hasta: dateFormatted
        }
        dispatch({ type: types.SAVE_TRACKING_DATA, payload: DATA });
    }

    const handleEdit = (prop, data) => {
        const DATA = {
            ...storedTrackingData,
            [prop]: data
        }
        dispatch({ type: types.SAVE_TRACKING_DATA, payload: DATA });
    }

    const validateData = (prop) =>{
        const value = storedTrackingData[prop];
        const validate = (value.trim().length > 0);
        return validate; 
    }

    const handleEditTitleSeguimiento = () => {
        if (editTitle) {
            const DATA = {
                id: trackingData.id,
                nombre: storedTrackingData.nombre,
                descripcion: storedTrackingData.descripcion,
                fecha_cierre: storedTrackingData.fecha_hasta == 'NaN-NaN-NaN' ? "10/10/1900" : convertDate2(storedTrackingData.fecha_hasta)
            }
            const validate = validateData('nombre') && validateData('descripcion');
            if(validate){
                editTrackingService(DATA, user.user.token).then((result) => {
                    if (result.success) {
                        setEditTitle(!editTitle);
                    }
                });
            }else{
                Alert.error("Debes completar todos los campos", {
                    effect: "stackslide",
                });
            }
           
        } else {
            setEditTitle(!editTitle);
        }

    }

    const handleChange = (prop, event) => {
        event.preventDefault();
        const DATA = {
            ...storedTrackingData,
            [prop]: event.target.value
        }
        dispatch({ type: types.SAVE_TRACKING_DATA, payload: DATA });
    }
    return (
        <Row lg={12} md={12} sm={12} xs={12} style={{ marginLeft: '5%' }}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                <>
                    <div className={styles.edit_title_icon}>
                        <IconButton onClick={handleEditTitleSeguimiento}>
                            {editTitle ? <DoneIcon /> : <EditIcon />}
                        </IconButton>
                    </div>

                    {!editTitle ?
                        <>
                            < TitlePage title={`Configuración del seguimiento ${storedTrackingData && storedTrackingData.nombre}`} />
                            <Col lg={12} md={12} sm={12} xs={12} className="left" style={{ paddingLeft: '20px' }}>
                                <span>{storedTrackingData && storedTrackingData.descripcion}</span>
                            </Col>
                        </>
                        :
                        <div className={styles.edit_header_container}>
                            <input
                                onChange={(e) => handleChange('nombre', e)}
                                value={storedTrackingData.nombre}
                                className={styles.edit_header_input}
                                autoFocus
                            />
                            <input
                                onChange={(e) => handleChange('descripcion', e)}
                                value={storedTrackingData.descripcion}
                                className={styles.edit_header_input}
                            />
                        </div>
                    }
                </>
            </Row>
            <div className={styles.sub_menu_container}>
                <SubMenu />
            </div>
            <Col lg={10} md={10} sm={10} xs={10} >
                <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>

                    {/* SECCIÓN 1 ALUMNOS Y MATERIAS*/}

                    {<div className={styles.collapse_container} onClick={() => setFirstSection(!firstSection)}>Alumnos y Materias {firstSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                    <Collapse in={firstSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <ConfigTable data={storedTrackingData.alumnos} tableName={"Alumnos"} />
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <ConfigTable data={storedTrackingData.materias} tableName={"Materias"} />
                        </Col>
                    </Collapse>

                    {/* SECCIÓN DOS PLAZOS Y PARTICIPANTES*/}

                    {<div className={styles.collapse_container} onClick={() => setSecondSection(!secondSection)}>Participantes y Plazos {secondSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}

                    <Collapse in={secondSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <div className={styles.edit_participants_icon}>
                                <Link href={`/dashboard/seguimientos/${storedTrackingData.id}/configuracion/participantes`}>
                                    <IconButton>
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            </div>
                            <ConfigTable data={storedTrackingData.integrantes} tableName={"Participantes"} />
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.table_container} ${styles.dates_container}`}>
                            <div>
                                <span className={styles.dates_label}>Plazos</span>

                                <div className={styles.edit_icon}>
                                    <IconButton onClick={handleSaveDates}>
                                        {editDates ? <EditIcon /> : <DoneIcon />}
                                    </IconButton>
                                </div>

                            </div>
                            <DateFilter
                                readOnlyStart
                                readOnlyEnd={editDates}
                                handleDate={handleDate}
                                start={storedTrackingData && storedTrackingData.fecha_desde}
                                end={storedTrackingData && storedTrackingData.fecha_hasta} />
                        </Col>
                    </Collapse>

                    {/* SECCIÓN TRES METAS Y OBJETIVOS*/}

                    {<div className={styles.collapse_container} onClick={() => setThirdSection(!thirdSection)}>Metas y Objetivos del seguimiento {thirdSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                    <Collapse in={thirdSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            {<EighthStepGoals editable handleEdit={handleEdit} />}
                        </Col>
                    </Collapse>
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={`${styles.container} ${styles.danger_area}`}>
                    {/* DANGER ZONE */}
                    {<div className={styles.collapse_container} onClick={() => setDangerZone(!dangerZone)}>Zona de finalización de seguimiento {dangerZone ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                    <Collapse in={dangerZone} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.table_container} ${styles.dates_container}`} id={styles.danger_zone_area}>
                            <span className={styles.end_label}>{trackingStatus ? 'Finalizar Seguimiento' : 'Seguimiento Finalizado'}</span>
                            <Modal
                                title={`¿Seguro que deseas ${trackingStatus ? 'finalizar' : 'activar '} el seguimiento?`}
                                body={<DeleteForm data={trackingData} handleSubmitAction={handleConfirmTrackingStatus} labelButton={trackingStatus ? 'Finalizando...' : 'Activando...'} />}
                                button={
                                    <Switch
                                        checked={!trackingStatus}
                                        color="primary"
                                        name="checkedB"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                }
                            />
                        </Col>
                    </Collapse>
                </Row>
            </Col>

        </Row>

    )
}

export default Configuracion;