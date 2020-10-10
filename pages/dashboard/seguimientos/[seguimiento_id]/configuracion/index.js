import styles from './styles.module.scss';
import { Row, Col } from "react-bootstrap";
import SubMenu from '../../../../../src/components/commons/sub_menu/sub_menu';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfigTable from '../../../../../src/components/configuration/config_table/config_table';
import { Collapse, IconButton, Switch } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFilter from '../../../../../src/components/tracking/view/date_filter/date_filter';
import EighthStepGoals from '../../../../../src/components/tracking/8_step_goals/eighth_step_goals';
import { getTrackingGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import EditIcon from '@material-ui/icons/Edit';
import BackgroundLoader from '../../../../../src/components/commons/background_loader/background_loader'
//REDUX TYPES
import * as types from "../../../../../redux/types";
import Link from "next/link";
import { parseGoalsData, parseParticipantsToShowOnTable, parseStudentsToShowOnTable,parseSubjectsToShowOnTable } from '../services/services';
import GeneralInfo from './general_info/general_info';
import DangerZone from './danger_zone/danger_zone';
import GoalsConfig from './goals/goals_config';


const Configuracion = () => {

    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store) => store.currentTracking);
    const [loading,setLoading] = useState(true);
    const [firstSection, setFirstSection] = useState();
    const [secondSection, setSecondSection] = useState();
    const [thirdSection, setThirdSection] = useState();
    const [adminView, setAdminView] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        currentTracking.integrantes.map((integrante) => {
            const isAdmin = integrante.usuario.id === user.user.id && integrante.rol.toUpperCase() === 'ENCARGADO';
            isAdmin && setAdminView(isAdmin);
        })
        getTrackingGoalsService(user.user.token, currentTracking.id).then((result) => {
            const GOALS = parseGoalsData(result.result);
            const GOALS_PAYLOAD = {
                ...currentTracking,
                ...GOALS
            }
            dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: GOALS_PAYLOAD });
            setLoading(false);
        })
    }, []);

    useEffect(()=>{
        return () =>{
            dispatch({type:types.RESET_CURRENT_TRACKING_DATA});
        }
    },[]);

    return (
        loading ? <BackgroundLoader show={loading}/> :
        <Row lg={12} md={12} sm={12} xs={12} style={{ marginLeft: '5%' }}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                <GeneralInfo adminView={adminView} />
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
                            <ConfigTable data={parseStudentsToShowOnTable(currentTracking.alumnos)} tableName={"Alumnos"} />
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <ConfigTable data={parseSubjectsToShowOnTable(currentTracking.materias)} tableName={"Materias"} />
                        </Col>
                    </Collapse>

                    {/* SECCIÓN DOS PLAZOS Y PARTICIPANTES*/}

                    {<div className={styles.collapse_container} onClick={() => setSecondSection(!secondSection)}>Participantes y Plazos {secondSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                    <Collapse in={secondSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <div className={adminView ? styles.edit_participants_icon : styles.display_none}>
                                <Link href={`/dashboard/seguimientos/${currentTracking.id}/configuracion/participantes`}>
                                    <IconButton>
                                        <EditIcon />
                                    </IconButton>
                                </Link>
                            </div>
                            <ConfigTable data={parseParticipantsToShowOnTable(currentTracking.integrantes)} tableName={"Participantes"} />
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.table_container} ${styles.dates_container}`}>
                            <DateFilter adminView={adminView} />
                        </Col>
                    </Collapse>

                    {/* SECCIÓN TRES METAS Y OBJETIVOS*/}

                    {<div className={styles.collapse_container} onClick={() => setThirdSection(!thirdSection)}>Metas y Objetivos del seguimiento {thirdSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                    <Collapse in={thirdSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                        <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                            <GoalsConfig adminView={adminView}/>
                        </Col>
                    </Collapse>
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={`${styles.container} ${styles.danger_area}`}>
                    {/* DANGER ZONE */}
                    {adminView && <DangerZone />}
                </Row>
            </Col>

        </Row>

    )
}

export default Configuracion;