import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from './styles.module.css';
//MATERIAL UI
import { getGoalsProgressionStudentService, getStudentGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label, PieChart, Pie, Sector, Cell, LabelList
} from 'recharts';
import { Col, Row } from "react-bootstrap";
import StudentViewer from "../../../../../src/components/tracking/view/student_viewer/student_viewer";
import BackLink from "../../../../../src/components/commons/back_link/back_link";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GeneralInfo from "../configuracion/general_info/general_info";
import { Collapse } from "@material-ui/core";
import DateConfig from "../../../../../src/components/tracking/view/date_config/date_config";
import ConfigTable from "../../../../../src/components/configuration/config_table/config_table";
import { parseParticipantsToShowOnTable, parseSubjectsToShowOnTable } from "../../../../../src/utils/general_services/services";
import Alert from "react-s-alert";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fromStoreToViewFormatDate } from "../../../../../src/utils/commons/common_services";


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


    const [firstSection, setFirstSection] = useState();
    const [secondSection, setSecondSection] = useState();
    const [thirdSection, setThirdSection] = useState();

    useEffect(() => {
        if (tracking) {
            setAlumnoSeleccionado(tracking?.alumnos[0]?.alumno?.id);
        }
    }, [tracking])

    const handleSelectStudent = (student) => {
        setAlumnoSeleccionado(student.id);
    }

    const handlePrintPage = () => {
        if(thirdSection){
            const input = document.getElementById('estadisticas');
            const student = tracking?.alumnos.filter((alumno)=>{return alumno.alumno.id === alumnoSeleccionado})[0];
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'px', "a4");
    
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
    
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
    
                const canvasWidth = canvas.width * ratio;
                const canvasHeight = canvas.height * ratio;
    
                const marginX = (pageWidth - canvasWidth) / 2;
    
                pdf.setFontSize(10)
                pdf.text(5, 10, `Reporte del Seguimiento: ${tracking.nombre}`);
                pdf.setFontSize(8);
                pdf.text(5, 20, `Fecha de Reporte: ${new Date().toLocaleString()}`);
                pdf.text(5, 30, `Generado por: ${user.user.name} ${user.user.last_name}`);
                pdf.text(5, 40, `Integrantes:`);
                let line = 40;
                tracking.integrantes.map((integrante,i)=>{
                    line = i === 0 ? (i+1)*10 + line : line + 10;
                    return pdf.text(5, line, `- ${integrante.usuario.name} ${integrante.usuario.last_name}`)
                })
                line = line + 10;
                pdf.text(5, line, `Materias:`);
                tracking.materias.map((materia, i)=>{
                    line = i === 0 ? (i+1)*10 + line : line + 10;
                    return pdf.text(5, line, `- Nombre: ${materia.nombre} - Año: ${materia.anio.nombre}`)
                })
                line = line + 10;
                pdf.text(5, line, `Plazos:`);
                line = line + 10;
                pdf.text(5, line, `Desde: ${fromStoreToViewFormatDate(tracking.fecha_inicio)}`);
                line = line + 10;
                pdf.text(5, line, `Hasta: ${fromStoreToViewFormatDate(tracking.fecha_cierre)}`);
                line = line + 10;
                pdf.text(5, line, `Alumno seleccionado:`)
                line = line + 10;
                pdf.text(5, line, `- ${student.alumno.nombre} ${student.alumno.apellido}`); 
                
                pdf.addImage(imgData, 'JPEG', marginX, line + 10, canvasWidth, canvasHeight);
                pdf.save(`Reporte ${tracking.nombre}.pdf`);
            });
        }else{
            Alert.error("Debe expandir el área de métricas y objetivos", {
                effect: "stackslide",
            });
        }
        
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
        if (alumnoSeleccionado && alumnoSeleccionado !== "") {

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
                        const noData = {}
                        asistenciaData.push(noData);
                        setProgresoAsistencias(asistenciaData);

                    } else {
                        setProgresoAsistencias(result.result.results);
                    }
                })
            }

            if (metricaPromedio && metricaPromedio?.id != "") {
                const dataCalificaciones = {
                    id_objetivo: metricaPromedio?.id,
                    id_alumno: alumnoSeleccionado
                }
                getGoalsProgressionStudentService(user.user.token, dataCalificaciones).then((result) => {
                    if (result.status === 204) {
                        const calificacionesData = [];
                        const noData = {}
                        const data = {
                            valor: -1
                        }
                        calificacionesData.push(noData);
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
                    porcentaje: Number.parseFloat(progreso.valor * 100).toFixed(2),
                    fecha: progreso.fecha_relacionada
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
                    promedio: progreso.valor,
                    fecha: progreso.fecha_relacionada
                }

                progresoCalificacionesAlumno.push(data);
            })

            setCalificacionesData(progresoCalificacionesAlumno);
        }
    }, [progresoCalificaciones])

    const formatterdata = (value, entry, index) => {
        return <span className={`${styles.pie_chart_references}`}>{value}</span>
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12}>
            <div className={styles.sub_menu_container}>
                <BackLink />
            </div>

            <Row lg={12} md={12} sm={12} xs={12} style={{ marginLeft: '5%' }}>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                    <GeneralInfo titleSection={"Estadísticas"} />
                    <Row lg={12} md={12} sm={12} xs={12} className={styles.select_students_container}>
                        <Col lg={10} md={10} sm={10} xs={10} className={styles.student_container}>
                            <div className={styles.item_container}>
                                <span className={styles.section_title}>Alumnos</span>
                                <StudentViewer students={tracking?.alumnos} handleSelectStudent={handleSelectStudent} />
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Col lg={10} md={10} sm={10} xs={10}>
                    <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>

                        {/* SECCIÓN 1 ALUMNOS Y MATERIAS*/}

                        {<div className={styles.collapse_container} onClick={() => setFirstSection(!firstSection)}>Materias {firstSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                        <Collapse in={firstSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                            <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                                <ConfigTable data={parseSubjectsToShowOnTable(tracking.materias)} tableName={"Materias"} />
                            </Col>
                        </Collapse>

                        {/* SECCIÓN DOS PLAZOS Y PARTICIPANTES*/}

                        {<div className={styles.collapse_container} onClick={() => setSecondSection(!secondSection)}>Participantes y Plazos {secondSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                        <Collapse in={secondSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                            <Col lg={12} md={12} sm={12} xs={12} className={styles.table_container}>
                                <ConfigTable data={parseParticipantsToShowOnTable(tracking.integrantes)} tableName={"Participantes"} />
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12} className={`${styles.table_container} ${styles.dates_container}`}>
                                <DateConfig />
                            </Col>
                        </Collapse>

                        {/* SECCIÓN TRES METAS Y OBJETIVOS*/}
                        <div id="estadisticas">
                            {<div className={styles.collapse_container} onClick={() => setThirdSection(!thirdSection)}>Metas y Objetivos del seguimiento {thirdSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}
                            <Collapse in={thirdSection} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                                <Row lg={12} md={12} sm={12} xs={12} className={styles.stats_row_container}>
                                    <Col lg={5} md={5} sm={5} xs={5} className={styles.stats_container}>
                                        <h3 className="subtitle mb-2">Progreso Calificaciones</h3>
                                        {calificacionesData.length != 0 ?
                                            <>
                                                <ResponsiveContainer width="100%" height={300} className="mx-auto">
                                                    <LineChart
                                                        data={calificacionesData}
                                                        className="mb-3"
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="fecha">

                                                        </XAxis>
                                                        <YAxis type="number" domain={[4, 10]} />
                                                        <Tooltip />
                                                        <Legend verticalAlign="top" height={36} />
                                                        <ReferenceLine y={tracking.promedio.value} label="Objetivo" stroke="red" /* alwaysShow */ ifOverflow="extendDomain" />
                                                        <Line type="monotone" dataKey="promedio" stroke="#004d67" activeDot={{ r: 8 }} />
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
                                                <ResponsiveContainer width="100%" height={300} className="mx-auto">
                                                    <LineChart
                                                        data={asistenciasData}
                                                        className="mb-3"
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="fecha">

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

                            </Collapse>
                        </div>
                    </Row>


                    <Col lg={12} md={12} sm={12} xs={12} style={{ margin: '20px 0px 20px 0px' }}>
                        <button className="ontrack_btn add_btn" onClick={handlePrintPage}>Generar Reporte</button>
                    </Col>

                </Col>
            </Row>


        </Row>
    )
}

export default Estadisticas;