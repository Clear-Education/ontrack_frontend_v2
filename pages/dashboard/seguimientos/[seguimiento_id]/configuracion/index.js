import styles from './styles.module.scss';
import { Row, Col } from "react-bootstrap";
import SubMenu from '../../../../../src/components/commons/sub_menu/sub_menu';
import { useEffect, useState } from 'react';
import { changeTrackingStatusService, editTrackingService } from '../../../../../src/utils/tracking/services/tracking_services';
import { useDispatch, useSelector } from 'react-redux';
import ConfigTable from '../../../../../src/components/configuration/config_table/config_table';
import { Collapse, IconButton, Switch } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFilter from '../../../../../src/components/tracking/view/date_filter/date_filter';
import EighthStepGoals from '../../../../../src/components/tracking/8_step_goals/eighth_step_goals';
import { getTrackingGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import Modal from '../../../../../src/components/commons/modals/modal'

//REDUX TYPES
import * as types from "../../../../../redux/types";
import DeleteForm from '../../../../../src/components/commons/delete_form/deleteForm';
import Link from "next/link";
import { parseGoalsData } from '../services/services';
import GeneralInfo from './general_info/general_info';


const Configuracion = () => {

    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store) => store.currentTracking);
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
    const [adminView, setAdminView] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        currentTracking.integrantes.map((integrante) => {
            const isAdmin = integrante.usuario.id === user.user.id && integrante.rol.toUpperCase() === 'ENCARGADO';
            isAdmin && setAdminView(isAdmin);
        })
        getTrackingGoalsService(user.user.token, currentTracking.id).then((result) => {
            setGoalsData(result.result);
        })
    },[])

    useEffect(() => {
        if (goalsData) {
            const GOALS = parseGoalsData(goalsData);
            let payload = {
                ...currentTracking,
                promedio: '',
                asistencia: '',
                cualitativos: [],
            }
            payload.cualitativos = GOALS.cualitativos
            payload.promedio = GOALS.promedio,
            payload.asistencia = GOALS.asistencia
            dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: payload });
        }

    }, [goalsData])
    
  
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
            ...currentTracking,
            [prop]: data
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: DATA });
    }


    return (
        <Row lg={12} md={12} sm={12} xs={12} style={{ marginLeft: '5%' }}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                <GeneralInfo adminView= {adminView}/>
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
                            <div className={adminView ? styles.edit_participants_icon : styles.display_none}>
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

                                <div className={adminView ? styles.edit_icon : styles.display_none}>
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
                            {<EighthStepGoals editable handleEdit={handleEdit} adminView={adminView} />}
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