import { Row, Col } from "react-bootstrap";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { KeyboardDatePicker } from "@material-ui/pickers";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { convertDateToSend, fromStoreToDateInputFormatDate, fromStoreToViewFormatDate } from "../../../../utils/commons/common_services";
import { useDispatch, useSelector } from "react-redux";
import { editTrackingService } from "../../../../utils/tracking/services/tracking_services";
import DoneIcon from '@material-ui/icons/Done';
import * as types from "../../../../../redux/types";
import { getActualSchoolYearService } from "../../../../utils/school_year/services/school_year_services";

const DateConfig = ({ adminView }) => {
    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store) => store.currentTracking);
    const [editDates, setEditDates] = useState(true);
    const [endDate, setEndDate] = useState();
    const [startDate, setStartDate] = useState();
    const [actualSchoolYear, setActualSchoolYear] = useState();
    const [validationDate, setValidationDate] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getActualSchoolYearService(user.user.token).then((result) => {
            setActualSchoolYear(result.result);
        })
    }, [])

    useEffect(() => {
        const formatedEndDate = fromStoreToDateInputFormatDate(currentTracking.fecha_cierre);
        const formatedStartDate = fromStoreToViewFormatDate(currentTracking.fecha_inicio);
        setEndDate(formatedEndDate);
        setStartDate(formatedStartDate);
    }, [currentTracking]);

    const handleDate = (date) => {
        setEndDate(date);
    }

    const handleError = (error) => {
        setValidationDate(error ? true : false)
    }

    const handleSaveDates = () => {
        if (!editDates) {
            const DATA = {
                id: currentTracking.id,
                nombre: currentTracking.nombre,
                descripcion: currentTracking.descripcion,
                fecha_cierre: convertDateToSend(endDate)
            }

            editTrackingService(DATA, user.user.token).then((result) => {
                if (result.success) {
                    let dateFormatted = result.result.fecha_cierre;
                    const DATA = {
                        ...currentTracking,
                        fecha_cierre: dateFormatted
                    }
                    dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: DATA });
                    setEditDates(!editDates);
                }
            });
        } else {
            setEditDates(!editDates);
        }
    }

    return (
        <>
            <div className={styles.title_container}>
                <span className={styles.dates_title}>Plazos</span>
                <span className={adminView ? styles.edit_icon : styles.display_none}>
                    <IconButton disabled={validationDate || !currentTracking.en_progreso} onClick={handleSaveDates}>
                        {editDates ? <EditIcon /> : <DoneIcon />}
                    </IconButton>
                </span>

            </div>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>

                <Col lg={5} md={5} sm={5} xs={5}>
                    <span className={styles.viwer_date}>{startDate}</span>
                </Col>

                <Col lg={2} md={2} sm={2} xs={2}><ArrowForwardIcon style={{ color: 'var(--orange)' }} /></Col>

                <Col lg={5} md={5} sm={5} xs={5}>

                    {
                        editDates ?
                            <span className={styles.viwer_date}>{fromStoreToViewFormatDate(currentTracking.fecha_cierre)}</span> :
                            <>
                                <span className={styles.date_label}>Hasta</span>
                                <KeyboardDatePicker
                                    clearable
                                    value={endDate}
                                    onChange={(date) => handleDate(date)}
                                    placeholder="DD/MM/YYYY"
                                    format="dd/MM/yyyy"
                                    minDate={startDate}
                                    maxDate={new Date(actualSchoolYear.fecha_hasta)}
                                    invalidDateMessage="Formato de fecha inválido"
                                    minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Seguimiento"
                                    maxDateMessage="La fecha no debería ser mayor a la fecha de Fin del Año Lectivo Actual"
                                    required
                                    onError={(error) => handleError(error)}

                                />
                            </>
                    }
                </Col>
            </Row>
        </>
    )
}

export default DateConfig;