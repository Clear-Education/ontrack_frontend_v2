import { Col, Row } from "react-bootstrap";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useEffect, useState } from "react";
import FilterListIcon from '@material-ui/icons/FilterList';
import { Collapse, IconButton } from "@material-ui/core";
import styles from './styles.module.scss';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import { convertDateToSendOnQuery, convertFormatToDatePicker } from "../../../../utils/commons/common_services";
import Delete from '@material-ui/icons/Delete';


const DateFilter = ({ handleSend, date, cambioAlumno, novedades }) => {

    const [endDate, setEndDate] = useState(date ? new Date(convertFormatToDatePicker(date.fecha_hasta)) : null);
    const [startDate, setStartDate] = useState(date ? new Date(convertFormatToDatePicker(date.fecha_desde)) : null);
    const [minDate, setMinDate] = useState(date ? new Date(convertFormatToDatePicker(date.fecha_desde)) : null);
    const [maxDate, setMaxDate] = useState(date ? new Date(convertFormatToDatePicker(date.fecha_hasta)) : null);
    const [errorMinDate, setErrorMinDate] = useState(false);
    const [errorMaxDate, setErrorMaxDate] = useState(false);
    const [showFilter, setShowFilter] = useState();

    useEffect(() => {
        setEndDate(date ? new Date(convertFormatToDatePicker(date.fecha_hasta)) : null);
        setStartDate(date ? new Date(convertFormatToDatePicker(date.fecha_desde)) : null);
    }, [cambioAlumno])

    const handleStartDate = (date) => {
        setStartDate(date);
    }

    const handleEndDate = (date) => {
        setEndDate(date);
    }


    const handleOpenFilter = () => {
        setShowFilter(!showFilter)
    }

    const handleDeleteFilter = () => {
        setEndDate(date ? new Date(convertFormatToDatePicker(date.fecha_hasta)) : null);
        setStartDate(date ? new Date(convertFormatToDatePicker(date.fecha_desde)) : null);
        handleSend();
    }

    const handleSendFilter = () => {
        const from = convertDateToSendOnQuery(startDate);
        const to = convertDateToSendOnQuery(endDate);
        handleSend(from, to);
    }


    return (
        <>
            <Collapse in={showFilter} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.filter_collapse_container}>
                    <Col lg={4} md={4} sm={4} xs={4} >
                        <KeyboardDatePicker
                            clearable
                            value={startDate}
                            onChange={(date) => handleStartDate(date)}
                            placeholder="DD/MM/YYYY"
                            format="dd/MM/yyyy"
                            invalidDateMessage="Formato de fecha inválido"
                            minDate={minDate}
                            maxDate={maxDate}
                            minDateMessage={novedades ? "La fecha no puede ser menor a la fecha de inicio del seguimiento" : "La fecha no puede ser menor a la fecha de inicio del año lectivo"}
                            maxDateMessage={novedades ? "La fecha no puede ser mayor a la fecha de fin del seguimiento" : "La fecha no puede ser mayor a la fecha de fin del año lectivo"}
                            required
                            onError={(error) => setErrorMinDate(error ? true : false)}
                        />
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} >
                        <ArrowForwardIcon />
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4} >
                        <KeyboardDatePicker
                            clearable
                            value={endDate}
                            onChange={(date) => handleEndDate(date)}
                            minDate={startDate}
                            maxDate={maxDate}
                            minDateMessage="La fecha no puede ser menor al filtro anterior"
                            maxDateMessage={novedades ? "La fecha no puede ser mayor a la fecha de fin del seguimiento" : "La fecha no puede ser mayor a la fecha de fin del año lectivo"}
                            placeholder="DD/MM/YYYY"
                            format="dd/MM/yyyy"
                            invalidDateMessage="Formato de fecha inválido"
                            required
                            onError={(error) => setErrorMaxDate(error ? true : false)}
                        />
                    </Col>

                </Row>
            </Collapse >


            {showFilter ?
                <div className={styles.filter_icon_container}>
                    <div>
                        <IconButton disabled={(errorMinDate || errorMaxDate) ? true : false} onClick={handleSendFilter}>
                            <DoneIcon />
                        </IconButton>
                    </div>
                    <div onClick={handleDeleteFilter}>
                        <IconButton>
                            <Delete />
                        </IconButton>
                    </div>
                    <div onClick={handleOpenFilter} >
                        <IconButton>
                            <CancelIcon />
                        </IconButton>
                    </div>
                </div>
                :
                <div className={styles.filter_icon_container} onClick={handleOpenFilter}>
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </div>
            }
        </>

    )
}

export default DateFilter;