import { Col, Row } from "react-bootstrap";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useState } from "react";
import FilterListIcon from '@material-ui/icons/FilterList';
import { Collapse, IconButton } from "@material-ui/core";
import styles from './styles.module.scss';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';
import { convertDateToSend } from "../../../../utils/commons/common_services";


const DateFilter = () => {

    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [showFilter, setShowFilter] = useState();


    const handleStartDate = (date) => {
        setStartDate(date);
    }

    const handleEndDate = (date) => {
        setEndDate(date);
    }


    const handleOpenFilter = () => {
        setShowFilter(!showFilter)
    }

    const handleSendFilter = () =>{
        const from = convertDateToSend(startDate);
        const to = convertDateToSend(endDate);
        console.log('enviando desde '+from+ " hasta: "+to);
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
                            required
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
                            minDateMessage="La fecha no puede ser menor al filtro anterior"
                            placeholder="DD/MM/YYYY"
                            format="dd/MM/yyyy"
                            invalidDateMessage="Formato de fecha inválido"
                            required
                        />
                    </Col>

                </Row>
            </Collapse >


            {showFilter ?
                <div className={styles.filter_icon_container}>
                    <div onClick={handleSendFilter}>
                        <IconButton>
                            <DoneIcon />
                        </IconButton>
                    </div>
                    <div onClick={handleOpenFilter} >
                        <IconButton>
                            <CancelIcon/>
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