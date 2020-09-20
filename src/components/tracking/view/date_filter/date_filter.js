import { Row, Col, FormLabel } from "react-bootstrap";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { KeyboardDatePicker } from "@material-ui/pickers";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";

const INITIAL_STATE = {
    start: '',
    end: '',
}
const DateFilter = ({ handleDate, readOnlyStart, readOnlyEnd, start, end }) => {

    const [state, setState] = useState(INITIAL_STATE);
    const endLocalDate = new Date(end);
    const [endDate, setEndDate] = useState(end ? new Date(endLocalDate.getTime() + endLocalDate.getTimezoneOffset() * 60000) : null);

    useEffect(() => {
        setState({ ...state, start: start })
    }, [start])


    useEffect(() => {
        setState({ ...state, end: end })
    }, [end])

    const handleEndDate = (date) => {
        setEndDate(date);
        setState({ ...state, end: date })
        handleDate(date);
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>

            <Col lg={5} md={5} sm={5} xs={5}>

                {
                    readOnlyStart ?
                        <span className={styles.viwer_date}>{start}</span>
                        :
                        <>
                            <span className={styles.date_label}>Desde</span>
                            <KeyboardDatePicker
                                clearable
                                value={state.start ? state.start : null}
                                placeholder="DD/MM/YYYY"
                                format="dd/MM/yyyy"
                                invalidDateMessage="Formato de fecha inválido"
                                minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Año Lectivo seleccionado"
                                maxDateMessage="La fecha no debería ser mayor a la fecha de Inicio del Año Lectivo seleccionado"
                                required
                            />
                        </>
                }
            </Col>

            <Col lg={2} md={2} sm={2} xs={2}><ArrowForwardIcon style={{ color: 'var(--orange)' }} /></Col>

            <Col lg={5} md={5} sm={5} xs={5}>

                {
                    readOnlyEnd ?
                        <span className={styles.viwer_date}>{state.end}</span> :
                        <>
                            <span className={styles.date_label}>Hasta</span>
                            <KeyboardDatePicker
                                clearable
                                value={endDate}
                                onChange={(date) => handleEndDate(date)}
                                placeholder="DD/MM/YYYY"
                                format="dd/MM/yyyy"
                                invalidDateMessage="Formato de fecha inválido"
                                minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Año Lectivo seleccionado"
                                maxDateMessage="La fecha no debería ser mayor a la fecha de Fin del Año Lectivo seleccionado"
                                required
                            />
                        </>
                }
            </Col>
        </Row>
    )
}

export default DateFilter;