import { Col, Row } from "react-bootstrap";
import styles from './styles.module.css';
import Form from '../commons/form/form';
import Alert from "react-s-alert";
import { FormLabel } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { getOneSchoolYearService } from "../../utils/school_year/services/school_year_services";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { convertDate, parseCsvToJson, parseStudentsDataToExport } from "../../utils/commons/common_services";
import { addNotasMultipleService } from "../../utils/notas/services/notas_services";
import ExportToXlsx from "../commons/export_to_xlsx/export_to_xlsx";


const INITIAL_STATE = {
    fecha: '',
    evaluacion: '',
    calificaciones: []
}
const CSVForm = ({ data, examDate, handleClose, refreshData }) => {
    const user = useSelector((store) => store.user);
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [state, setState] = useState({...INITIAL_STATE, fecha: examDate || '' });

    useEffect(() => {
        getOneSchoolYearService(user.user.token, data.school_year).then((result) => {
            setMinDate(result.result.fecha_desde);
            setMaxDate(result.result.fecha_hasta);
        })
    }, [])

    const handleDate = (date) => {
        setState({ ...state, fecha: date });
    }

    const validationDate = () => {
        return (state.fecha !== "" && state.fecha <= new Date() && state.fecha > new Date(minDate));
    }
    async function handleDataToSubmit(submitData) {
        if (!!Object.keys(submitData).length && validationDate()) {
            parseCsvToJson(submitData.media, handleSubmit);
        } else {
            Alert.error("Debe subir un archivo CSV y proporcionar una fecha válida para continuar", {
                effect: "stackslide",
            });
        }
    }
    const handleSubmit = (dataToSend) => {
        let calificaciones = [];
        dataToSend.map((alumno) => {
            let alumnoData = {
                alumno: alumno.id,
                puntaje: alumno.puntaje
            }
            calificaciones.push(alumnoData);
        });

        const DATA = {
            fecha: convertDate(state.fecha),
            calificaciones: calificaciones,
            evaluacion: data.exam
        }

        addNotasMultipleService(user.user.token, DATA).then((result) => {
            if (result.success) {
                handleClose();
                refreshData();
            }
        })
    }

    return (
        <div className={styles.csv_container}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.input_container}>
                    <FormLabel className="left" component="legend">Fecha del Exámen</FormLabel>
                    <KeyboardDatePicker
                        clearable
                        value={state.fecha ? state.fecha : examDate ? examDate : null}
                        placeholder="DD/MM/YYYY"
                        onChange={date => handleDate(date)}
                        minDate={new Date(minDate)}
                        maxDate={new Date()}
                        format="dd/MM/yyyy"
                        invalidDateMessage="Formato de fecha inválido"
                        minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Año Lectivo seleccionado"
                        maxDateMessage="La fecha no debería ser mayor a la fecha de hoy"
                        required
                    />
                </Col>
            </Row>
            <div className={styles.message_alert}>
                <p>
                    Se recomienda siempre el uso de la plantilla propuesta.
                </p>
            </div>
            <Row lg={12} md={12} sm={12} xs={12}>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <ExportToXlsx fileData={parseStudentsDataToExport(data.students)} template_name="plantilla_notas_ontrack"/>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.form_container}>
                    <Form
                        handleSubmit={handleDataToSubmit}
                        button={<button className="ontrack_btn csv_btn" style={{ width: '100%' }}>Enviar</button>}
                        inputs={[
                            {
                                type: "file",
                                name: "media",
                                fileAreaDisabled: false,
                                fileAreaIcon: <img src="/icons/carpeta.svg" style={{ width: 70 }} />,
                                fileAreaTitle: { text: "Cargar archivo", size: 18 },
                                fileAreaDescription: {
                                    text: "Solo se permiten documentos con extensión .csv o .xlsx",
                                    size: 14,
                                },
                                fileType: ".csv,.xlsx",
                                fileAcceptMultiple: false,
                            },
                        ]}
                    />
                </Col>
            </Row>
        </div >
    )
}

export default CSVForm;