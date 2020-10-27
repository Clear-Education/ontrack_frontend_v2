import { motion } from "framer-motion";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Row, Col } from "react-bootstrap";
import { InputLabel, Select, MenuItem, useTheme, useMediaQuery, MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import styles from './styles.module.css';
import { useState } from "react";
import { useSelector } from "react-redux";
import config from "../../../utils/config";
import useSWR from "swr";
import { getGroupsService } from "../../../utils/user/service/user_services";
import CountrySelector from "../../commons/country_selector/country_selector";
import MaskedInput from 'react-text-mask';
import Input from "@material-ui/core/Input";



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
    name: false,
    last_name: false,
    email: false,
    dni: false,
    legajo: false,
    cargo: false,
    groups: false,
    phone: false,
    date_of_birth: false,
    direccion: false,
    localidad: false,
    provincia: false,
};

const CellphoneCustom = (props) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={[
                "(",
                /[1-9]/,
                /\d/,
                /\d/,
                ")",
                " ",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ]}
            placeholderChar={"\u2000"}
            showMask
        />
    );
};

const theme_input_phone = createMuiTheme({
    overrides: {
        MuiInput: {
            formControl: {
                "label + &": {
                    marginTop: "0px"
                }
            }
        }
    }
});

const EditUserForm = (props) => {
    const [state, setState] = useState(props.user);
    const initialStateUserAccount = props.user.is_active;
    const url = `${config.api_url}/users/groups/list/`;
    const [validation, setValidation] = useState(VALIDATE_INITIAL_STATE);
    const [groupsData, setGroupsData] = useState(null);
    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down("719"));
    const [date, setDate] = useState(props.user.date_of_birth);
    const user = useSelector((store) => store.user);

    useSWR(url, () =>
        getGroupsService(user.user.token).then((result) => {
            setGroupsData(result.result);
        })
    );

    const handleValidation = (prop, value) => {
        if (prop == "dni") {
            if (value.toString().length != 8) {
                setValidation({
                    ...validation,
                    [prop]: true
                })
                return
            }
        }
        if (prop == "date_of_birth") {
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
        setValidation({
            ...validation,
            [prop]: !(value.trim().length > 0),
        });
    };

    const handleChange = (prop) => (event) => {
        if (prop == "phone") {
            let value = event.target.value.replace("(", "");
            value = value.replace(")", "");
            value = value.replace("-", "");
            value = value.replace(" ", "");
            setState({ ...state, phone: value });
        }
        else if (prop == "is_active") {
            setState({ ...state, [prop]: JSON.parse(event.target.value) });
        }
        else if (prop !== "groups") {
            handleValidation(prop, event.target.value);
            setState({ ...state, [prop]: event.target.value });
        }
    };

    const handleChangeCountryRegion = (prop, value) => {
        setState({ ...state, [prop]: value })
    }

    const convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
    };

    const handleChangeDate = (date) => {
        setDate(date);
        let formatedDate = convertDate(date);
        handleValidation("date_of_birth", date);
        setState({ ...state, ["date_of_birth"]: formatedDate });
    };



    const handleSubmit = (e) => {
        if (state.is_active != initialStateUserAccount) {
            props.handleSubmitEditUserState(e, state);
            props.handleClose(false);
        } else if (initialStateUserAccount == true) {

            if (Object.values(validation).includes(true)) {
                e.preventDefault()
                return
            }

            props.handleSubmitEditUser(e, state);
            props.handleClose(false);
        } else {
            e.preventDefault();
            props.handleClose(false);
        }
    }

    return (
        <motion.span
            initial="hidden"
            animate="visible"
            variants={list}
            style={{ listStyleType: "none", marginLeft: "0" }}
        >
            <Row>
                <Col>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <p>El usuario debe estar "Activo" para su edición</p>

                        <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="name"
                                            name="name"
                                            label="Nombre"
                                            variant="outlined"
                                            value={state.name}
                                            onChange={handleChange("name")}
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
                                        />
                                    </FormControl>
                                </motion.li>
                            </Col>

                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="last_name"
                                            name="last_name"
                                            label="Apellido"
                                            variant="outlined"
                                            value={state.last_name}
                                            onChange={handleChange("last_name")}
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
                                        />
                                    </FormControl>
                                </motion.li>
                            </Col>

                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="dni"
                                            name="dni"
                                            label="D.N.I"
                                            variant="outlined"
                                            value={state.dni}
                                            onChange={handleChange("dni")}
                                            type="number"
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
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
                                </motion.li>
                            </Col>
                        </Row>


                        <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="Email"
                                            variant="outlined"
                                            value={state.email}
                                            onChange={handleChange("email")}
                                            type="email"
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
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
                                </motion.li>
                            </Col>

                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="legajo"
                                            name="legajo"
                                            label="Legajo"
                                            variant="outlined"
                                            value={state.legajo}
                                            onChange={handleChange("legajo")}
                                            type="number"
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
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
                                </motion.li>
                            </Col>

                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <KeyboardDatePicker
                                            clearable
                                            label="Fecha de nacimiento"
                                            value={date ? date : null}
                                            placeholder="01/05/2020"
                                            onChange={(date) => handleChangeDate(date)}
                                            inputVariant="outlined"
                                            maxDate={new Date('2003')}
                                            format="dd/MM/yyyy"
                                            invalidDateMessage="El formato de fecha es inválido"
                                            maxDateMessage="El usuario debe ser mayor de 18 años"
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
                                        />
                                    </FormControl>
                                </motion.li>
                            </Col>
                        </Row>

                        <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <InputLabel id="cargo">Cargo Institución</InputLabel>
                                        <Select
                                            labelId="cargo"
                                            name="cargo"
                                            id="cargo"
                                            defaultValue={state.cargo || ''}
                                            value={state.cargo}
                                            onChange={handleChange("cargo")}
                                            disabled={initialStateUserAccount == false ? true : false}
                                            required
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Seleccionar</em>
                                            </MenuItem>
                                            <MenuItem value="Administrativo">
                                                <em>Administrativo</em>
                                            </MenuItem>
                                            <MenuItem value="Directivo">
                                                <em>Directivo</em>
                                            </MenuItem>
                                            <MenuItem value="Profesor">
                                                <em>Profesor</em>
                                            </MenuItem>
                                            <MenuItem value="Pedagogo">
                                                <em>Pedagogo</em>
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </motion.li>
                            </Col>
                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <MuiThemeProvider theme={theme_input_phone}>
                                            <InputLabel
                                                htmlFor="phone"
                                                required
                                            >
                                                Celular
                                    </InputLabel>
                                            <Input
                                                value={state.phone}
                                                onChange={handleChange("phone")}
                                                name="phone"
                                                id="phone"
                                                className={styles.input}
                                                required
                                                inputComponent={CellphoneCustom}
                                                disabled={initialStateUserAccount == false ? true : false}
                                            />
                                            <FormHelperText id="helper-text">(cod area) xxx-xxxx</FormHelperText>
                                        </MuiThemeProvider>
                                    </FormControl>
                                </motion.li>
                            </Col>
                            <Col lg={4} md={4} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <InputLabel id="groups">Tipo de Cuenta</InputLabel>
                                        <Select
                                            labelId="groups"
                                            id="groups"
                                            value={state.groups.id ? state.groups.id : state.groups}
                                            onChange={handleChange("groups")}
                                            required
                                            disabled={initialStateUserAccount == false ? true : false}
                                        >
                                            <MenuItem disabled value="">
                                                <em>Seleccionar</em>
                                            </MenuItem>
                                            {groupsData && groupsData.map((group) => {
                                                return (
                                                    <MenuItem value={group.id} key={group.id}>
                                                        {group.name}
                                                    </MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </motion.li>
                            </Col>
                        </Row>
                        <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                            <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <TextField
                                            id="direccion"
                                            name="direccion"
                                            label="Dirección, Localidad, Calle, Número"
                                            variant="outlined"
                                            value={state.direccion ? state.direccion : ""}
                                            onChange={handleChange("direccion")}
                                            disabled={initialStateUserAccount == false ? true : false}
                                            required
                                        />
                                    </FormControl>
                                </motion.li>
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12} className={fullscreen && styles.input_container}>
                                <motion.li variants={item}>
                                    <FormControl variant="outlined">
                                        <InputLabel id="estado">Estado Usuario</InputLabel>
                                        <Select
                                            labelId="estado"
                                            id="estado"
                                            value={state.is_active}
                                            onChange={handleChange("is_active")}
                                            required
                                        >
                                            <MenuItem disabled value="">
                                                <em>Seleccionar</em>
                                            </MenuItem>
                                            <MenuItem value="true">
                                                <em>Activo</em>
                                            </MenuItem>
                                            <MenuItem value="false">
                                                <em>Suspendido</em>
                                            </MenuItem>

                                        </Select>
                                    </FormControl>
                                </motion.li>
                            </Col>
                        </Row>

                        <div style={{ margin: 15 }}>
                            <CountrySelector setState={handleChangeCountryRegion} previousValue={{ provincia: state.provincia, localidad: state.localidad }} />
                        </div>

                        <motion.li variants={item}>
                            <Row lg={12} md={12} sm={12} xs={12} className="center" style={{ justifyContent: 'center' }}>
                                <Col>
                                    <button
                                        className="ontrack_btn_modal ontrack_btn add_btn"
                                        type="submit">Editar</button>
                                </Col>
                            </Row>
                        </motion.li>
                    </form>
                </Col>
            </Row>
        </motion.span>
    )

}

export default EditUserForm;