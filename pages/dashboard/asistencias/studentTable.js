import { Col, Row } from "react-bootstrap"
import MUIDataTable from "mui-datatables"
import { useState, useEffect } from "react";
import MTConfig from "../../../src/utils/table_options/MT_config";
import { getStudentsCourseService } from '../../../src/utils/student/service/student_service';
import { getAsistencias2Service } from "../../../src/utils/asistencias/services/asistencias_services";
import { getOneSchoolYearService } from "../../../src/utils/school_year/services/school_year_services";
import { useSelector } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import styles from './styles.module.scss'
import Modal from '../../../src/components/commons/modals/modal';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import { KeyboardDatePicker } from "@material-ui/pickers";
import EditAsistenciaForm from "../../../src/components/asistencias/edit_asistencia_form";
import Delete from '@material-ui/icons/Delete';
import DeleteForm from '../../../src/components/commons/delete_form/deleteForm';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CalendarView from "../../../src/components/asistencias/calendar/calendar_view";


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0099cb',
        },
        secondary: {
            main: '#ff9100',
        },
    },

});

const StudentTable = ({ data, handleAdd, handleEdit, handleDelete }) => {

    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDateAssistance, setSelectedDateAssistance] = useState("");
    const [fechaValida, setFechaValida] = useState(false)
    const [dateVerAsistencia, setDateVerAsistencia] = useState(null);
    const [dateAgregarAsistencia, setDateAgregarAsistencia] = useState(null);

    const [addStudentAssistance, setAddStudentAssistance] = useState([]);
    const [editStudentAssistance, setEditStudentAssistance] = useState([]);
    const [selectedData, setSelectedData] = useState();

    const [tableToShow, setTableToShow] = useState();
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState(false);

    async function getAsistencias() {
        getAsistencias2Service(user.user.token, data.curso, selectedDate).then((result) => {
            setIsLoading(false);
            let studentsCourseAssistance = []
            result.result.results?.forEach((element) => {
                const dataAssistance = {
                    id_asistencia: element.id,
                    asistio: element.asistio === 1 ? true : false,
                    descripcion: element.descripcion,
                    fecha: element.fecha,
                    nombre: element.alumno_curso.alumno.nombre,
                    apellido: element.alumno_curso.alumno.apellido,
                    legajo: element.alumno_curso.alumno.legajo,
                    email: element.alumno_curso.alumno.email,

                }
                studentsCourseAssistance.push(dataAssistance)
            })

            setEditStudentAssistance(studentsCourseAssistance)

        })
    }

    async function getSchoolYear() {
        getOneSchoolYearService(user.user.token, data.school_year).then((result) => {
            setMinDate(result.result.fecha_desde);
            setMaxDate(result.result.fecha_hasta);
        })
    }

    useEffect(() => {
        setIsLoading(true);
        getStudentsCourseService(user.user.token, data.curso, data.school_year).then((result) => {
            setIsLoading(false);
            let students = [];
            result.result.results.forEach((element) => {
                const dataStudent = {
                    alumno_curso: element.id,
                    curso: element.curso.nombre,
                    nombre: element.alumno.nombre,
                    apellido: element.alumno.apellido,
                    legajo: element.alumno.legajo,
                    email: element.alumno.email,
                    fecha_desde: element.anio_lectivo.fecha_desde,
                    fecha_hasta: element.anio_lectivo.fecha_hasta,
                    fecha: null,
                    asistio: null
                }
                students.push(dataStudent);
            })
            setAddStudentAssistance(students);
        })

        if (minDate == "") {
            getSchoolYear()
        }
    }, [tableToShow, selectedDateAssistance]);


    useEffect(() => {
        if (selectedDate != "") {
            getAsistencias()
        }
    }, [selectedDate, fechaValida])


    const handleChangeAssistance = (event, index) => {
        let newArray = [...addStudentAssistance];
        if (event.target.name == "no_asistio" && event.target.checked == true) {
            newArray[index]["asistio"] = !(event.target.checked)
            setAddStudentAssistance(newArray)
        } else if (event.target.name == "asistio" && event.target.checked == true) {
            newArray[index][event.target.name] = event.target.checked
            setAddStudentAssistance(newArray)
        }
    }

    const handleChangeEditAssistance = (event, index) => {
        let newArray = [...editStudentAssistance];
        if (event.target.name == "no_asistio" && event.target.checked == true) {
            newArray[index]["asistio"] = !(event.target.checked)
            setEditStudentAssistance(newArray)
        } else if (event.target.name == "asistio" && event.target.checked == true) {
            newArray[index][event.target.name] = event.target.checked
            setEditStudentAssistance(newArray)
        }

        return handleEdit(newArray[index]).then(result => {
        })
    }

    const handleTableToShow = (table) => {
        setTableToShow(table);
        setFechaValida(false)
        setDateVerAsistencia(null)
        setDateAgregarAsistencia(null)
    }

    const handleDeleteAssistance = (e, data) => {
        return handleDelete(e, data).then((result) => {
            if (result.success) {
                getAsistencias()
            }
            return result
        });
    }

    const convertDate = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
    }

    const convertDate2 = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
    }

    const convertDate3 = (inputFormat) => {
        function pad(s) {
            return s < 10 ? "0" + s : s;
        }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-")
    }

    const handleDateAssistance = (date) => {
        setDateVerAsistencia(date);
        let dateFormatted = convertDate(date);

        let dateSelectedFormatted = Date.parse(dateFormatted)
        let minimalDate = Date.parse(minDate)
        let maximalDate = Date.parse(new Date())

        if (dateSelectedFormatted >= minimalDate && dateSelectedFormatted <= maximalDate) {
            let dateFormatted2 = convertDate3(date)
            setSelectedDate(dateFormatted2)
            setFechaValida(true)
        } else {
            setFechaValida(false)
        }
    }

    const handleDateAddAssistance = (date) => {
        setDateAgregarAsistencia(date);
        let dateFormatted = convertDate(date);

        let dateSelectedFormatted = Date.parse(dateFormatted)
        let minimalDate = Date.parse(minDate)
        let maximalDate = Date.parse(new Date())

        if (dateSelectedFormatted >= minimalDate && dateSelectedFormatted <= maximalDate) {
            setFechaValida(true)
            let dateFormatted2 = convertDate2(date)
            setSelectedDateAssistance(dateFormatted2)
        } else {
            setFechaValida(false)
        }
    }

    const handleSubmitAssistance = () => {
        let studentsAssistance = []
        addStudentAssistance.filter(s => s.asistio != null).map(student => {
            let studentData = {
                fecha: selectedDateAssistance,
                asistio: student.asistio ? 1 : 0,
                alumno_curso: student.alumno_curso
            }
            studentsAssistance.push(studentData)
        })
        return handleAdd(studentsAssistance);
    }

    return (
        <Row style={{ margin: 0, justifyContent: 'center' }}>
            <Col
                md={11}
                sm={11}
                xs={11}
                style={{ margin: '30px 0px 30px 0px' }}
            >
                <Row className={styles.table_button_container}>
                    <Col>
                        <button onClick={() => handleTableToShow('add')} className="ontrack_btn add_btn" style={{ padding: 10 }}>Agregar Asistencias</button>
                    </Col>
                    <Col>
                        <button onClick={() => handleTableToShow('view')} className="ontrack_btn add_btn" style={{ padding: 10 }}>Ver Asistencias</button>
                    </Col>
                    <Col>
                        <button onClick={() => handleTableToShow('ver')} className="ontrack_btn add_btn" style={{ padding: 10 }}>Modificar Asistencias</button>
                    </Col>
                </Row>
                {
                    isLoading && tableToShow !== undefined ?
                        "Cargando..." :
                        tableToShow == "add" ?

                            <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                                <Col lg={12} md={12} sm={12} xs={12} className={styles.input_container}>

                                    <FormLabel className="left" component="legend">Fecha</FormLabel>
                                    <KeyboardDatePicker
                                        clearable
                                        value={dateAgregarAsistencia}
                                        placeholder="DD/MM/YYYY"
                                        onChange={date => handleDateAddAssistance(date)}
                                        minDate={new Date(minDate)}
                                        maxDate={new Date()}
                                        format="dd/MM/yyyy"
                                        invalidDateMessage="Formato de fecha inválido"
                                        minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Año Lectivo actual"
                                        maxDateMessage="La fecha no debería ser mayor a la fecha de hoy"
                                        required
                                    />
                                </Col>
                            </Row>
                            :
                            null
                }
                {
                    (fechaValida && tableToShow == "add") ?
                        <>
                            <MuiThemeProvider theme={theme}>
                                <MUIDataTable
                                    title={"Alumnos del Curso"}
                                    data={addStudentAssistance}
                                    options={MTConfig("Alumnos").options}
                                    components={MTConfig().components}
                                    localization={MTConfig().localization}
                                    columns={[

                                        {
                                            name: "id",
                                            label: "Id",
                                            options: {
                                                display: false,
                                                filter: false
                                            },

                                        },
                                        {
                                            name: "nombre",
                                            label: "Nombre",
                                        },
                                        {
                                            name: "apellido",
                                            label: "Apellido",
                                        },
                                        {
                                            name: "legajo",
                                            label: "Legajo",
                                        },
                                        {
                                            name: "email",
                                            label: "Email",
                                        },
                                        {
                                            name: "actions",
                                            label: "Asistencia",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    return (
                                                        <div style={{ display: 'flex' }}>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={addStudentAssistance[dataIndex].asistio} onChange={(e) => handleChangeAssistance(e, dataIndex)} name="asistio" />}
                                                                label="Asistió"
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={(addStudentAssistance[dataIndex].asistio === false)} onChange={(e) => handleChangeAssistance(e, dataIndex)} name="no_asistio" />}
                                                                label="No Asistió"
                                                            />
                                                        </div>
                                                    )
                                                },
                                                filter: false
                                            },
                                        }
                                    ]}
                                />
                            </MuiThemeProvider>
                            <div className="d-flex">
                                <button className="ontrack_btn add_btn ml-auto mt-3" onClick={handleSubmitAssistance}>
                                    Registrar Asistencias
                                </button>
                            </div>
                        </>
                        : null
                }
                {
                    tableToShow == 'ver' ?
                        <Row lg={12} md={12} sm={12} xs={12} className={styles.row_input_container}>
                            <Col lg={12} md={12} sm={12} xs={12} className={styles.input_container}>

                                <FormLabel className="left" component="legend">Fecha</FormLabel>
                                <KeyboardDatePicker
                                    clearable
                                    value={dateVerAsistencia}
                                    placeholder="DD/MM/YYYY"
                                    onChange={date => handleDateAssistance(date)}
                                    minDate={new Date(minDate)}
                                    maxDate={new Date()}
                                    format="dd/MM/yyyy"
                                    invalidDateMessage="Formato de fecha inválido"
                                    minDateMessage="La fecha no debería ser menor a la fecha de Inicio del Año Lectivo actual"
                                    maxDateMessage="La fecha no debería ser mayor a la fecha de hoy"
                                    required
                                />

                            </Col>
                        </Row>
                        : tableToShow === 'view' ?
                            <CalendarView calendarData={data} />
                            :
                            null
                }

                {
                    (fechaValida && tableToShow == "ver") &&
                    <Row lg={12} md={12} sm={12} xs={12} >
                        <Col lg={12} md={12} sm={12} xs={12} >
                            <MuiThemeProvider theme={theme}>
                                <MUIDataTable
                                    title={"Asistencias de Alumnos"}
                                    data={editStudentAssistance}
                                    options={MTConfig("Alumnos").options}
                                    components={MTConfig().components}
                                    localization={MTConfig().localization}
                                    columns={[

                                        {
                                            name: "id_asistencia",
                                            label: "Id",
                                            options: {
                                                display: false,
                                                filter: false
                                            },

                                        },
                                        {
                                            name: "nombre",
                                            label: "Nombre",
                                        },
                                        {
                                            name: "apellido",
                                            label: "Apellido",
                                        },
                                        {
                                            name: "legajo",
                                            label: "Legajo",
                                        },
                                        {
                                            name: "email",
                                            label: "Email",
                                        },
                                        {
                                            name: "actions",
                                            label: "Asistencia",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    return (
                                                        <div style={{ display: 'flex' }}>
                                                            <FormControlLabel
                                                                control={<Checkbox checked={editStudentAssistance[dataIndex].asistio} onChange={(e) => handleChangeEditAssistance(e, dataIndex)} name="asistio" />}
                                                                label="Asistió"
                                                            />
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    checked={(editStudentAssistance[dataIndex].asistio === false)} onChange={(e) => handleChangeEditAssistance(e, dataIndex)} name="no_asistio" />}
                                                                label="No Asistió"
                                                            />
                                                        </div>
                                                    )
                                                },
                                                filter: false
                                            },
                                        }
                                    ]}
                                />
                            </MuiThemeProvider>
                        </Col>
                    </Row>
                }

            </Col>
        </Row>

    )
}

export default StudentTable