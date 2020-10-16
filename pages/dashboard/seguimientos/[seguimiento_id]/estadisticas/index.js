import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from './styles.module.css';
import DateViewer from "../../../../../src/components/commons/date_viewer/date_viewer";
//MATERIAL UI
import { getGoalsProgressionStudentService, getStudentGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label, PieChart, Pie, Sector, Cell, LabelList
} from 'recharts';
import { Col, Row } from "react-bootstrap";
import TitlePage from "../../../../../src/components/commons/title_page/title_page";
import StudentViewer from "../../../../../src/components/tracking/view/student_viewer/student_viewer";
import ParticipantItem from "../../../../../src/components/commons/participant_item/participant_item";
import { fromStoreToViewFormatDate } from "../../../../../src/utils/commons/common_services";
import SubjectItem from "../../../../../src/components/commons/subject_item/subject_item";
import BackLink from "../../../../../src/components/commons/back_link/back_link";


const container = {
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

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className={`bg-white w-75 ${styles.contenedor}`}>
                <p className="text-dark mb-0"><b>Objetivo:</b> {payload[0].name}</p>
                <p className={payload[0].payload.alcanzada ? "text-success" : "text-danger"}>
                    <b>Estado: </b> {`${payload[0].payload.alcanzada ? "Alcanzado" : "No Alcanzado"}`}
                </p>
                {/* <p className="intro">{getIntroOfPage(label)}</p> */}
            </div>
        );
    }

    return null;
};

const Estadisticas = () => {

    const [metricaPromedio, setMetricaPromedio] = useState(null);
    const [metricaAsistencia, setMetricaAsistencia] = useState(null);
    const [progresoAsistencias, setProgresoAsistencias] = useState([]);
    const [progresoCalificaciones, setProgresoCalificaciones] = useState([]);
    const [calificacionesData, setCalificacionesData] = useState([]);
    const [asistenciasData, setAsistenciasData] = useState([]);

    const [estadoObjetivosCualitativos, setEstadoObjetivosCualitativos] = useState([]);
    const [objetivosCualitativosData, setObjetivosCualitativosData] = useState([]);

    const tracking = useSelector((store) => store.currentTracking);
    const user = useSelector((store) => store.user);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#8884d8", "#82ca9d", "#B04A75", "#64C9B8", "#EAF08C", "#593EEE"];

    const [selectedStudent, setSelectedStudent] = useState();

    useEffect(() => {
        if (tracking) {
            setAlumnoSeleccionado(tracking.alumnos[0].alumno?.id);
        }
    }, [tracking])

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setAlumnoSeleccionado(student.id);
    }

    // VERIFICA QUE METRICAS TIENE EL SEGUIMIENTO
    useEffect(() => {
        if (tracking.asistencia) {
            setMetricaAsistencia(tracking.asistencia);
        }
        if (tracking.promedio) {
            setMetricaPromedio(tracking.promedio)
        }
    }, [])

    //BUSQUEDAS DE PROGRESOS DE OBJETIVOS
    useEffect(() => {
        if (alumnoSeleccionado != "") {

            if (tracking.cualitativos.length !== 0) {
                getStudentGoalsService(user.user.token, alumnoSeleccionado, tracking.id).then((result) => {
                    let estado_objetivos = result.result.filter((objetivo) => !objetivo.objetivo.valor_objetivo_cuantitativo);
                    setEstadoObjetivosCualitativos(estado_objetivos);
                })
            }

            if (metricaAsistencia?.id != "") {
                const dataAsistencia = {
                    id_objetivo: metricaAsistencia?.id,
                    id_alumno: alumnoSeleccionado
                }
                getGoalsProgressionStudentService(user.user.token, dataAsistencia).then((result) => {
                    if (result.status === 204) {
                        const asistenciaData = [];
                        const data = {
                            valor: 1
                        }
                        asistenciaData.push(data);
                        setProgresoAsistencias(asistenciaData);

                    } else {
                        setProgresoAsistencias(result.result.results);
                    }
                })
            }

            if (metricaPromedio?.id != "") {
                const dataCalificaciones = {
                    id_objetivo: metricaPromedio?.id,
                    id_alumno: alumnoSeleccionado
                }
                getGoalsProgressionStudentService(user.user.token, dataCalificaciones).then((result) => {
                    if (result.status === 204) {
                        const calificacionesData = [];
                        const data = {
                            valor: -1
                        }
                        calificacionesData.push(data);
                        setProgresoCalificaciones(calificacionesData);

                    } else {
                        setProgresoCalificaciones(result.result.results);
                    }
                })
            }
        }
    }, [alumnoSeleccionado])


    //OBJETIVOS CUALITATIVOS PARA GRAFICO
    useEffect(() => {
        const estadoObjetivosAlumno = [];
        estadoObjetivosCualitativos.map(estado_objetivo => {
            const data = {
                name: estado_objetivo.objetivo.descripcion,
                value: 1 / estadoObjetivosCualitativos.length,
                alcanzada: estado_objetivo.alcanzada
            }
            estadoObjetivosAlumno.push(data);
        })

        setObjetivosCualitativosData(estadoObjetivosAlumno);

    }, [estadoObjetivosCualitativos])


    //PROGRESO ASISTENCIAS Y CALIFICACIONES PARA GRAFICO
    useEffect(() => {
        if (progresoAsistencias) {
            let progresoAsistenciasAlumno = []
            progresoAsistencias.map((progreso) => {
                const data = {
                    porcentaje: Number.parseFloat(progreso.valor * 100).toFixed(2)
                }

                progresoAsistenciasAlumno.push(data);
            })

            setAsistenciasData(progresoAsistenciasAlumno);
        }
    }, [progresoAsistencias])

    useEffect(() => {
        if (progresoCalificaciones) {
            let progresoCalificacionesAlumno = []
            progresoCalificaciones.map((progreso) => {
                const data = {
                    promedio: progreso.valor
                }

                progresoCalificacionesAlumno.push(data);
            })

            setCalificacionesData(progresoCalificacionesAlumno);
        }
    }, [progresoCalificaciones])


    const handleChangeAlumno = (data) => {
        setAlumnoSeleccionado(data);
    }

    const formatterdata = (value, entry, index) => {
        return <span className={`${styles.pie_chart_references}`}>{value}</span>
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12}>
            <div className={styles.sub_menu_container}>
                <BackLink />
            </div>
            <Col lg={12} md={12} sm={12} xs={12} >
                <TitlePage title={"Estadísticas"} fontSize={20} />
            </Col>

            <Row lg={12} md={12} sm={12} xs={12} style={{ width: '100%' }}>
                <Col lg={3} md={3} sm={3} xs={3} className={styles.student_container}>
                    <div className={styles.item_container}>
                        <span className={styles.section_title}>Alumnos</span>
                        <StudentViewer students={tracking?.alumnos} handleSelectStudent={handleSelectStudent} />
                    </div>
                </Col>
                <Col lg={9} md={9} sm={9} xs={9}>
                    <Row lg={12} md={12} sm={12} xs={12} style={{ height: '100%', marginLeft: '10px' }}>
                        <div className={styles.general_info}>
                            <Col lg={6} md={6} sm={6} xs={6}>
                                <div className={styles.general_item_container}>
                                    <span className={styles.section_title}>Seguimiento
                                        <span className={styles.title_name}> {tracking.nombre}</span>
                                    </span>
                                    <span className={styles.description}>"{tracking.descripcion}"</span>
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                                <div className={styles.general_item_container}>
                                    <span className={styles.section_title}>Integrantes</span>
                                    <ParticipantItem integrantes={tracking.integrantes} />
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                                <div className={styles.general_item_container}>
                                    <span className={styles.section_title}>Fechas</span>
                                    <DateViewer
                                        start={tracking.fecha_inicio}
                                        end={tracking.fecha_cierre} />
                                </div>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}>
                                <div className={styles.general_item_container}>
                                    <span className={styles.section_title}>Materias</span>
                                    <SubjectItem materias={tracking.materias} />
                                </div>
                            </Col>
                        </div>

                    </Row>

                </Col>
            </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.stats_row_container}>
                    <Col lg={5} md={5} sm={5} xs={5} className={styles.stats_container}>
                        <h3 className="subtitle mb-2">Progreso Calificaciones</h3>
                        {calificacionesData.length != 0 ?
                            <>
                                <ResponsiveContainer width="60%" height={300} className="mx-auto">
                                    <LineChart
                                        data={calificacionesData}
                                        className="mb-3"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name">
                                            <Label value="Porcentaje de Calificaciones en el Año Lectivo" offset={0} position="insideBottom" />
                                        </XAxis>
                                        <YAxis type="number" domain={[4, 10]} />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        <ReferenceLine y={tracking.promedio.value} label="Objetivo" stroke="red" /* alwaysShow */ ifOverflow="extendDomain" />
                                        <Line type="monotone" dataKey="promedio" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                            :
                            "No configurado"
                        }

                    </Col>
                    <Col lg={5} md={5} sm={5} xs={5} className={styles.stats_container}>
                        <h3 className="subtitle mb-2 mt-3">Progreso Asistencias</h3>
                        {asistenciasData.length != 0 ?
                            <>
                                <ResponsiveContainer width="60%" height={300} className="mx-auto">
                                    <LineChart
                                        data={asistenciasData}
                                        className="mb-3"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name">
                                            <Label value="Porcentaje de Asistencias en el Año Lectivo" offset={0} position="insideBottom" />
                                        </XAxis>
                                        <YAxis type="number" domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend verticalAlign="top" height={36} />
                                        <ReferenceLine y={tracking.asistencia.value} label="Objetivo" stroke="red" ifOverflow="extendDomain" />
                                        <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                            : "No configurado"
                        }
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={12} className={styles.stats_container}>
                        <h3 className="subtitle mb-2 mt-5">Objetivos Cualitativos</h3>
                        {objetivosCualitativosData.length != 0 ?
                            <>
                                <ResponsiveContainer width="60%" height={300} className="mx-auto">
                                    <PieChart>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend verticalAlign="top" formatter={formatterdata} />
                                        <Pie
                                            data={objetivosCualitativosData}
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {
                                                objetivosCualitativosData.map((objeto, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)

                                            }
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </>
                            :
                            "No configurado"
                        }
                    </Col>
                </Row>
        </Row>
    )
}

export default Estadisticas;