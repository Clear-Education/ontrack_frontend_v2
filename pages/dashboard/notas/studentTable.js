import { Col, Row } from "react-bootstrap"
import MUIDataTable from "mui-datatables"
import { useState, useEffect } from "react";
import MTConfig from "../../../src/utils/table_options/MT_config";
import { getStudentsCourseExamService } from '../../../src/utils/student/service/student_service';
import { getNotasCursoService } from "../../../src/utils/notas/services/notas_services";
import { getOneSchoolYearService } from "../../../src/utils/school_year/services/school_year_services";
import { useSelector } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import styles from './styles.module.scss'


import Modal from '../../../src/components/commons/modals/modal';
import EditIcon from '@material-ui/icons/Edit';
import Icon from '@material-ui/core/Icon';
import { IconButton } from '@material-ui/core';
import AddNotasForm from '../../../src/components/notas/add_notas_form';
import { orange } from '@material-ui/core/colors';
import EditNotasForm from "../../../src/components/notas/edit_notas.form";
import Delete from '@material-ui/icons/Delete';
import DeleteForm from '../../../src/components/commons/delete_form/deleteForm';
import CSVForm from "../../../src/components/notas/add_csv_form";
import { mutate } from "swr";
import config from "../../../src/utils/config";
import { getExamService } from "../../../src/utils/exam/services/exam_services";
import { fromApiToDateInputFormatDate } from "../../../src/utils/commons/common_services";


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

const url = `${config.api_url}/calificaciones/list/`;

const StudentTable = ({ data, handleAdd, handleEdit, handleDelete }) => {
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [addStudentAssistance, setAddStudentAssistance] = useState([]);
    const [editStudentAssistance, setEditStudentAssistance] = useState([]);
    const [selectedData, setSelectedData] = useState();
    const [tableToShow, setTableToShow] = useState();
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState(false);
    const [examDate,setExamDate] = useState()

    async function getCalificacionesCurso() {
        getNotasCursoService(user.user.token, data.curso, data.exam).then((result) => {
            setIsLoading(false);
            let students = [];
            result.result.results.forEach((element) => {
                const dataStudent = {
                    nombre: element.alumno.nombre,
                    apellido: element.alumno.apellido,
                    legajo: element.alumno.legajo,
                    id_calificacion: element.id,
                    puntaje: element.puntaje,
                    evaluacion: element.evaluacion,
                    fecha: element.fecha, 
                    fecha_desde: minDate,
                    fecha_hasta: maxDate
                }

                students.push(dataStudent);

            })
            setEditStudentAssistance(students);
            mutate(url);
        })
    }

    async function getSchoolYear() {
        getOneSchoolYearService(user.user.token, data.school_year).then((result) => {
            setMinDate(result.result.fecha_desde);
            setMaxDate(result.result.fecha_hasta);
        })
    }

    useEffect(() => {
        getCalificacionesCurso()
        setIsLoading(true);
        getStudentCourseExam();
        if (minDate == "") {
            getSchoolYear()
        }
    }, [tableToShow]);

    useEffect(()=>{
        getExamService(user.user.token,data.exam).then((result)=>{
            if(result.success){
                const PARSED_DATE = fromApiToDateInputFormatDate(result.result.fecha);
                setExamDate(PARSED_DATE);
            }
        })
    },[])

    async function getStudentCourseExam (){
        getStudentsCourseExamService(user.user.token, data.curso, data.school_year, data.exam).then((result) => {
            setIsLoading(false);
            let students = [];
            result.result.results.forEach((element) => {
                const dataStudent = {
                    id: element.alumno.id,
                    alumno_curso: element.id,
                    curso: element.curso.nombre,
                    nombre: element.alumno.nombre,
                    apellido: element.alumno.apellido,
                    legajo: element.alumno.legajo,
                    email: element.alumno.email,
                    evaluacion: data.exam,
                    puntaje: element.puntaje_field
                }

                students.push(dataStudent);
            })
            setAddStudentAssistance(students);
        });
    }

    const handleRefreshData = () =>{
        setIsLoading(true);
        setTableToShow();
        getStudentCourseExam().then((res)=>{
            setTableToShow('delete');
        });
        mutate(`${config.api_url}/alumnos/curso/multiple/`)
    }

    const handleTableToShow = (table) => {
        setTableToShow(table);
    }

    const handleAddNota = (e, data) => {
        return handleAdd(e, data);
    }

    async function handleEditNota(e, datos) {
        return handleEdit(e, datos).then((result) => {
            if (result.success) {
                getCalificacionesCurso()
            }
            return result;
        });
    }

    const handleDeleteNota = (e, data) => {
        return handleDelete(e, data).then((result) => {
            if (result.success) {
                getCalificacionesCurso()
            }
            return result
        });
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
                        <button onClick={() => handleTableToShow('add')} className="ontrack_btn add_btn" style={{ padding: 10, width: '75%' }}>Agregar Manualmente</button>
                    </Col> 
                    <Col>
                        <Modal
                            title="Agregar Calificación por CSV"
                            body={<CSVForm 
                                    data={{...data,students:addStudentAssistance}}
                                    examDate={examDate}
                                    refreshData = {handleRefreshData}
                                    />}
                            button={ 
                                <button
                                    className="ontrack_btn add_btn"
                                    style={{ padding: 10, width: '75%' }}>
                                    Agregar vía CSV
                        </button>
                            }
                        />
                    </Col>
                    <Col>
                        <button onClick={() => handleTableToShow('delete')} className="ontrack_btn add_btn" style={{ padding: 10, width: '75%' }}>Ver Calificaciones</button>
                    </Col>
                </Row>
                {
                    isLoading && tableToShow !== undefined ?
                        "Cargando..." :
                        tableToShow === "add" ?

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
                                            label: "Calificación",
                                            options: {
                                                customBodyRenderLite: (dataIndex) => {
                                                    return (
                                                        <div style={{ display: 'flex' }}>
                                                            <Modal
                                                                title="Agregar Calificación"
                                                                body={<AddNotasForm
                                                                    data={selectedData}
                                                                    minDate={minDate} 
                                                                    maxDate={maxDate}
                                                                    examDate={examDate}
                                                                    handleSubmitAction={handleAddNota} />}
                                                                button={
                                                                    <IconButton onClick={() => setSelectedData(addStudentAssistance[dataIndex])} >
                                                                        <Icon style={{ color: orange[500] }}>add_circle</Icon>
                                                                    </IconButton>
                                                                }
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
                            : tableToShow === 'delete' ?
                                <Row lg={12} md={12} sm={12} xs={12} >
                                    <Col lg={12} md={12} sm={12} xs={12} >
                                        <MuiThemeProvider theme={theme}>
                                            <MUIDataTable
                                                title={"Calificaciones de Alumnos"}
                                                data={editStudentAssistance}
                                                options={MTConfig("Alumnos").options}
                                                components={MTConfig().components}
                                                localization={MTConfig().localization}
                                                columns={[

                                                    {
                                                        name: "id_alumno",
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
                                                        name: "fecha",
                                                        label: "Fecha",
                                                    },
                                                    {
                                                        name: "puntaje",
                                                        label: "Puntaje",
                                                    },
                                                    {
                                                        name: "actions",
                                                        label: "Acciones",
                                                        options: {
                                                            customBodyRenderLite: (dataIndex) => {
                                                                return (<>
                                                                    <div style={{ display: 'flex' }}>
                                                                        <Modal
                                                                            title="Editar Calificación"
                                                                            body={
                                                                                <EditNotasForm
                                                                                    data={selectedData}
                                                                                    minDate={minDate}
                                                                                    maxDate={maxDate} handleSubmitAction={handleEditNota} />
                                                                            }
                                                                            button={
                                                                                <IconButton onClick={() => setSelectedData(editStudentAssistance[dataIndex])} >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            }
                                                                        />
                                                                        <Modal
                                                                            title="¿Seguro que deseas eliminar la calificación de este alumno?"
                                                                            body={<DeleteForm data={selectedData} handleSubmitAction={handleDeleteNota} />}
                                                                            button={
                                                                                <IconButton onClick={() => setSelectedData(editStudentAssistance[dataIndex])} >
                                                                                    <Delete />
                                                                                </IconButton>
                                                                            }
                                                                        />
                                                                    </div>
                                                                </>)
                                                            },
                                                        },
                                                    }
                                                ]}
                                            />
                                        </MuiThemeProvider>
                                    </Col>
                                </Row>
                                :
                                null
                }
            </Col>
        </Row>

    )
}

export default StudentTable