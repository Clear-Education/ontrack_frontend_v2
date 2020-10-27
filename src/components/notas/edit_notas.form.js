import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { motion } from "framer-motion";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Row, Col } from "react-bootstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from './styles.module.css'
import { InputLabel, Select, MenuItem } from "@material-ui/core";

import { useState } from "react";

const list = {
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    hidden: {
        opacity: 0,
        transition: {
            when: "afterChildren",
        },
    },
};

const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
};

const VALIDATE_INITIAL_STATE = {
    puntaje: false
};


const EditNotasForm = (props) => {
    const [state, setState] = useState({ ...props.data, ["fecha_desde"]: props.minDate, ["fecha_hasta"]: props.maxDate });
    const LocalDate = new Date(props.data?.fecha);
    const [date, setDate] = useState(new Date(LocalDate.getTime() + LocalDate.getTimezoneOffset() * 60000))
    const [validation, setValidation] = useState(VALIDATE_INITIAL_STATE);
    const [isLoading, setIsLoading] = useState(false);

    const hadleValidation = (prop, value) => {

        if (prop === "puntaje") {
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
                [prop]: !(value.trim().length > 0),
            });
        }
    };

    const handleChange = (prop) => (event) => {

        hadleValidation(prop, event.target.value);
        setState({ ...state, [prop]: event.target.value })

    };

    const convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
    }

    const handleSubmit = (e) => {
        setIsLoading(true);

        if (validation["puntaje"] === false) {
            props.handleSubmitAction(e, state).then((result) => {
                setIsLoading(false)
                if (result.success) {
                    props.handleClose(false);
                }
            });
        } else {
            e.preventDefault();
            setIsLoading(false);
        }
    }

    return (
        <div>
            <motion.span
                initial="hidden"
                animate="visible"
                variants={list}
                style={{ listStyleType: "none", marginLeft: "0" }}
            >
                <Row>
                    <Col>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={12} md={12} sm={12} xs={12} className={styles.input_container}>
                                    <motion.li variants={item}>
                                        <FormControl variant="outlined">
                                            <TextField
                                                id="puntaje"
                                                name="puntaje"
                                                label="Calificación"
                                                variant="outlined"
                                                value={state.puntaje}
                                                onChange={handleChange("puntaje")}
                                                type="number"
                                                required
                                            />
                                        </FormControl>
                                        {validation.puntaje && (
                                            <FormHelperText
                                                className="helper-text"
                                                style={{ color: "rgb(182, 60, 47)" }}
                                            >
                                                La calificación del alumno debe ser un número comprendido entre 0 y 10.
                                            </FormHelperText>
                                        )}
                                    </motion.li>
                                </Col>
                            </Row>
                            <motion.li variants={item}>
                                <Row lg={12} md={12} sm={12} xs={12} className="center" style={{ justifyContent: 'center' }}>
                                    <Col>
                                        {!isLoading ?
                                            <button className="ontrack_btn_modal ontrack_btn add_btn" type="submit">Guardar</button>
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
                            </motion.li>
                        </form>
                    </Col>
                </Row>
            </motion.span>
        </div>
    );


}
export default EditNotasForm;