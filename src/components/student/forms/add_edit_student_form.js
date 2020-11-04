import { motion } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Row, Col } from "react-bootstrap";
import { useTheme, useMediaQuery } from "@material-ui/core";

import styles from './styles.module.css'
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getStudentService } from "../../../utils/student/service/student_service";
import CountrySelector from "../../commons/country_selector/country_selector";
import { convertDateToSend } from "../../../utils/commons/common_services";
import Modal from "../../commons/modals/modal";
import CSVStudentsForm from "./csv_form/csv_students_form";

const INITIAL_STATE = {
    nombre: '',
    apellido: '',
    dni: '',
    legajo: '',
    email: '',
    fecha_nacimiento: '',
    direccion: '',
    localidad: '',
    provincia: '',
    fecha_inscripcion: '',
}

const VALIDATE_INITIAL_STATE = {
    nombre: false,
    apellido: false,
    dni: false,
    legajo: false,
    email: false,
    fecha_nacimiento: false,
    direccion: false,
    localidad: false,
    provincia: false,
    fecha_inscripcion: false,
};

const AddEditStudentForm = (props) => {

    const [state, setState] = useState(INITIAL_STATE);
    const [validation, setValidation] = useState(VALIDATE_INITIAL_STATE);
    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down("719"));
    const user = useSelector((store) => store.user)
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        if (props.data) {
            setIsLoading(true)
            getStudentService(user.user.token, props.data).then((result) => {
                setIsLoading(false)
                if (result.success) {
                    setState(result.result);
                } else {
                    props.handleClose();
                }

            })
        }
    }, [])

    const hadleValidation = (prop, value) => {
        if (prop == "dni") {
            if (value.toString().length != 8) {
                setValidation({
                    ...validation,
                    [prop]: true
                })
                return
            }
        }
        if (prop == "fecha_nacimiento") {
            if (Date.parse(value) < Date.parse(new Date('2003'))) {
                setValidation({
                    ...validation,
                    [prop]: false
                })
                return
            } else {
                setValidation({
                    ...validation,
                    [prop]: true
                })
                return
            }
        }
        if (prop == "fecha_inscripcion") {
            if (Date.parse(value) < Date.parse(new Date())) {
                setValidation({
                    ...validation,
                    [prop]: false
                })
                return
            } else {
                setValidation({
                    ...validation,
                    [prop]: true
                })
                return
            }

        }
        setValidation({
            ...validation,
            [prop]: !(value.trim().length > 0),
        });
    };

    const handleChange = (prop) => (event) => {

        hadleValidation(prop, event.target.value);
        setState({ ...state, [prop]: event.target.value })

    };

    const handleChangeCountryRegion = (prop, value) => {
        setState({ ...state, [prop]: value })
    }


    const handleChangeDate = (date, prop) => {
        hadleValidation(prop, date)
        setState({ ...state, [prop]: date })
    };


    const handleSubmit = (e) => {

        if (Object.values(validation).includes(true)) {
            e.preventDefault()
            return
        }

        e.preventDefault();
        setIsLoading(true);
        let parseData = { ...state };
        if (parseData['fecha_nacimiento'] !== "") {
            parseData['fecha_nacimiento'] = convertDateToSend(parseData['fecha_nacimiento']);
        }
        if (parseData['fecha_inscripcion'] !== "") {
            parseData['fecha_inscripcion'] = convertDateToSend(parseData['fecha_inscripcion']);
        }

        props.handleSubmitAction(e, parseData).then((result) => {
            setIsLoading(false)
            if (result.success) {
                props.handleClose(false);
            }
        });
    }


    const handleRefresData = () =>{
        props.handleClose(false);
    }

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Row>
                <Col>
                    {isLoading ? 'Cargando...' :
                        <form onSubmit={handleSubmit}>
                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="nombre"
                                            name="nombre"
                                            label="Nombre"
                                            variant="outlined"
                                            value={state.nombre}
                                            onChange={handleChange("nombre")}
                                            required
                                        />
                                    </FormControl>
                                    {validation.nombre && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Esta campo no puede estar vacio
                                        </FormHelperText>
                                    )}

                                </Col>

                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="apellido"
                                            name="apellido"
                                            label="Apellido"
                                            variant="outlined"
                                            value={state.apellido}
                                            onChange={handleChange("apellido")}
                                            required
                                        />
                                    </FormControl>
                                    {validation.apellido && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Esta campo no puede estar vacio
                                        </FormHelperText>
                                    )}

                                </Col>
                            </Row>


                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="dni"
                                            name="dni"
                                            label="D.N.I"
                                            variant="outlined"
                                            value={state.dni}
                                            onChange={handleChange("dni")}
                                            type='number'
                                            required
                                        />
                                    </FormControl>
                                    {validation.dni && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Introduzca un número válido de DNI
                                        </FormHelperText>
                                    )}

                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="Email"
                                            variant="outlined"
                                            value={state.email}
                                            onChange={handleChange("email")}

                                        />
                                    </FormControl>
                                    {validation.email && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Esta campo no puede estar vacio
                                        </FormHelperText>
                                    )}

                                </Col>

                            </Row>

                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="legajo"
                                            name="legajo"
                                            label="Legajo"
                                            variant="outlined"
                                            value={state.legajo}
                                            onChange={handleChange("legajo")}

                                        />
                                    </FormControl>
                                    {validation.legajo && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Esta campo no puede estar vacio
                                        </FormHelperText>
                                    )}

                                </Col>

                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <KeyboardDatePicker
                                            clearable
                                            label="Fecha de nacimiento"
                                            value={state.fecha_nacimiento ? state.fecha_nacimiento : null}
                                            placeholder="01/05/2020"
                                            onChange={(date) => handleChangeDate(date, 'fecha_nacimiento')}
                                            inputVariant="outlined"
                                            maxDate={new Date('2003')}
                                            format="dd/MM/yyyy"
                                            invalidDateMessage="El formato de fecha es inválido"
                                            minDateMessage="La fecha no puede ser menor al día de hoy"
                                            maxDateMessage="La fecha no puede ser mayor al máximo permitido"

                                        />
                                    </FormControl>

                                </Col>

                            </Row>


                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <TextField
                                            id="direccion"
                                            name="direccion"
                                            label="Dirección, Localidad, Calle, Número"
                                            variant="outlined"
                                            value={state.direccion}
                                            onChange={handleChange("direccion")}

                                        />
                                    </FormControl>
                                    {validation.direccion && (
                                        <FormHelperText
                                            className="helper-text"
                                            style={{ color: "rgb(182, 60, 47)" }}
                                        >
                                            Esta campo no puede estar vacio
                                        </FormHelperText>
                                    )}

                                </Col>
                                <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>

                                    <FormControl variant="outlined">
                                        <KeyboardDatePicker
                                            clearable
                                            label="Fecha de inscripción"
                                            value={state.fecha_inscripcion ? state.fecha_inscripcion : null}
                                            placeholder="01/05/2020"
                                            onChange={(date) => handleChangeDate(date, "fecha_inscripcion")}
                                            inputVariant="outlined"
                                            maxDate={new Date()}
                                            format="dd/MM/yyyy"
                                            invalidDateMessage="El formato de fecha es inválido"
                                            minDateMessage="La fecha no puede ser menor al día de hoy"
                                            maxDateMessage="La fecha no puede ser mayor a la fecha actual"
                                        />
                                    </FormControl>

                                </Col>
                            </Row>

                            <div style={{ margin: 15 }}>
                                <CountrySelector
                                    setState={handleChangeCountryRegion}
                                    previousValue={{ provincia: state.provincia, localidad: state.localidad }}
                                    color={'var(--white)'}
                                />
                            </div>


                            <Row lg={12} md={12} sm={12} xs={12} className="center" style={{ justifyContent: 'center' }}>
                                <Col>
                                    {!isLoading ?
                                        <button className="ontrack_btn_modal ontrack_btn add_btn" type="submit">Guardar Alumno</button>
                                        :
                                        <button className="ontrack_btn_modal ontrack_btn add_btn" disabled>
                                            <CircularProgress
                                                size={18}
                                                color="primary"
                                            />
                                            {" "}Guardando...
                                        </button>
                                    }
                                </Col>

                            </Row>

                            {
                                !props.data &&

                                <Row lg={12} md={12} sm={12} xs={12} className="center" style={{ justifyContent: 'center' }}>
                                    <Col>
                                        {!isLoading ?
                                            <>
                                                <div className={styles.adornment}></div>
                                                <Modal
                                                    title="Agregar Calificación por CSV"
                                                    body={<CSVStudentsForm refreshData={handleRefresData}/>}
                                                    button={<button className="ontrack_btn_modal ontrack_btn csv_btn" type="submit">Importar CSV</button>}
                                                />

                                                <div className={styles.adornment}></div>
                                            </>
                                            :
                                            <button className="ontrack_btn_modal ontrack_btn add_btn" disabled>
                                                <CircularProgress
                                                    size={18}
                                                    color="primary"
                                                />
                                                {" "}Guardando...
                                                </button>
                                        }
                                    </Col>

                                </Row>

                            }
                        </form>
                    }
                </Col>
            </Row>
        </motion.div>
    )


}


export default AddEditStudentForm


