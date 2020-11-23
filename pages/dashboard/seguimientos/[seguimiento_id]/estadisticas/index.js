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
import { convertDate2, fromStoreToViewFormatDate } from "../../../../../src/utils/commons/common_services";
import { getActualSchoolYearService } from "../../../../../src/utils/school_year/services/school_year_services";
import DateFilter from "../../../../../src/components/tracking/view/date_filter/date_filter";


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
    const [añoActual, setAñoActual] = useState();
    const [fechaDesdeFiltro, setFechaDesdeFiltro] = useState();
    const [fechaHastaFiltro, setFechaHastaFiltro] = useState();
    const [cambioAlumnoSeleccionado, setCambioAlumnoSeleccionado] = useState(false);

    const tracking = useSelector((store) => store.currentTracking);
    const user = useSelector((store) => store.user);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#8884d8", "#82ca9d", "#B04A75", "#64C9B8", "#EAF08C", "#593EEE"];


    const [firstSection, setFirstSection] = useState();
    const [secondSection, setSecondSection] = useState();
    const [thirdSection, setThirdSection] = useState(true);

    useEffect(() => {
        if (tracking) {
            setAlumnoSeleccionado(tracking?.alumnos[0]?.alumno?.id);
        }
    }, [tracking])

    useEffect(() => {
        getActualSchoolYearService(user.user.token).then(result => {
            setAñoActual(result.result);
        })
    }, [])

    const handleSelectStudent = (student) => {
        setAlumnoSeleccionado(student.id);
    }

    const dateFormatter = (date) => {
        let datearray = date?.split("-");
        let formatDate = '10/10/1997';
        if (!!datearray?.length) {
            const day = +datearray[0];
            const month = datearray[1];
            const year = +datearray[2]
            formatDate = `${day}/${month}/${year}`
        }
        return formatDate;
    }


    const handlePrintPage2 = () => {
        const student = tracking?.alumnos.filter((alumno) => { return alumno.alumno.id === alumnoSeleccionado })[0];
        const input = document.getElementById('estadisticas');
        let totalHeight = input.offsetHeight;
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;
        window.scrollTo(0, 0);
        html2canvas(input).then((canvas) => {
            const widthRatio = pdfWidth / canvas.width;
            const sX = 0;
            const sWidth = canvas.width;
            const sHeight = pdfHeight + ((pdfHeight - pdfHeight * widthRatio) / widthRatio);
            const dX = 0;
            const dY = 0;
            const dWidth = sWidth;
            const dHeight = sHeight;
            let pageCnt = 1;
            pdf.setFontSize(10);
            pdf.text(5, 10, `Reporte del Seguimiento: ${tracking.nombre}`);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text(5, 18, `Fecha de Reporte: ${new Date().toLocaleString()}`);
            pdf.text(5, 26, `Alumno:`);
            pdf.setFont('helvetica', 'normal');
            pdf.text(8, 34, `- ${student.alumno.nombre} ${student.alumno.apellido}`)
            pdf.setFont('helvetica', 'bold');
            pdf.text(5, 42, `Integrantes:`);
            let line = 42;
            pdf.setFont('helvetica', 'normal');
            tracking.integrantes.map((integrante, i) => {
                line = i === 0 ? (i + 1) * 8 + line : line + 8;
                return pdf.text(8, line, `- ${integrante.rol}: ${integrante.usuario.name} ${integrante.usuario.last_name}`)
            })
            line = line + 8;
            pdf.setFont('helvetica', 'bold');
            pdf.text(5, line, `Materias:`);
            pdf.setFont('helvetica', 'normal');
            tracking.materias.map((materia, i) => {
                line = i === 0 ? (i + 1) * 8 + line : line + 8;
                return pdf.text(8, line, `- Nombre: ${materia.nombre} - Año: ${materia.anio.nombre}`)
            })
            line = line + 8;
            pdf.setFont('helvetica', 'bold');
            pdf.text(5, line, `Plazos del seguimiento:`);
            line = line + 8;
            pdf.setFont('helvetica', 'normal');
            pdf.text(8, line, `- Fecha Desde: ${fromStoreToViewFormatDate(tracking.fecha_inicio)}`);
            line = line + 8;
            pdf.text(8, line, `- Fecha Hasta: ${fromStoreToViewFormatDate(tracking.fecha_cierre)}`);

            if (metricaPromedio?.id != "") {
                line = line + 8;
                pdf.setFont('helvetica', 'bold');
                pdf.text(5, line, `Progreso Calificaciones ${(fechaDesdeFiltro && fechaHastaFiltro) ? `desde ${convertDate2(fechaDesdeFiltro)} hasta ${convertDate2(fechaHastaFiltro)}` : `desde ${fromStoreToViewFormatDate(añoActual.fecha_desde)} hasta ${fromStoreToViewFormatDate(añoActual.fecha_hasta)} `}`);
                line = line + 8;
                pdf.setFont('helvetica', 'normal');
                pdf.text(8, line, `- Calificación: ${progresoCalificaciones[progresoCalificaciones.length - 1].valor ? progresoCalificaciones[progresoCalificaciones.length - 1].valor : `No definido`}`);
                line = line + 8;
                pdf.text(8, line, `- Fecha última actualización: ${progresoCalificaciones[progresoCalificaciones.length - 1].fecha_relacionada ? dateFormatter(progresoCalificaciones[progresoCalificaciones.length - 1].fecha_relacionada) : `No definido`}`);
            }
            if (metricaAsistencia?.id != "") {
                line = line + 8;
                pdf.setFont('helvetica', 'bold');
                pdf.text(5, line, `Progreso Asistencias ${(fechaDesdeFiltro && fechaHastaFiltro) ? `desde ${convertDate2(fechaDesdeFiltro)} hasta ${convertDate2(fechaHastaFiltro)}` : `desde ${fromStoreToViewFormatDate(añoActual.fecha_desde)} hasta ${fromStoreToViewFormatDate(añoActual.fecha_hasta)}`}`);
                line = line + 8;
                pdf.setFont('helvetica', 'normal');
                pdf.text(8, line, `- Asistencia: ${Number.parseFloat((progresoAsistencias[progresoAsistencias.length - 1].valor) * 100).toFixed(2)} %`);
                line = line + 8;
                pdf.text(8, line, `- Fecha última actualización: ${progresoAsistencias[progresoAsistencias.length - 1].fecha_relacionada ? dateFormatter(progresoAsistencias[progresoAsistencias.length - 1].fecha_relacionada) : `No definido`}`);

            }

            while (totalHeight > 0) {
                totalHeight -= sHeight;
                let sY = sHeight * (pageCnt - 1);
                const childCanvas = document.createElement('CANVAS');
                childCanvas.setAttribute('width', sWidth);
                childCanvas.setAttribute('height', sHeight);
                const childCanvasCtx = childCanvas.getContext('2d');
                childCanvasCtx.drawImage(canvas, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

                if (pageCnt > 1) {
                    pdf.addPage();
                }
                pdf.setPage(pageCnt);
                pdf.addImage(childCanvas.toDataURL('image/png'), 'PNG', 0, line + 5, canvas.width * widthRatio, 0);
                pageCnt++;
            }

            pdf.save(`Reporte ${tracking.nombre}.pdf`);
        });
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
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
            setCambioAlumnoSeleccionado(!cambioAlumnoSeleccionado);
            setFechaDesdeFiltro(false);
            setFechaHastaFiltro(false);

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
        return <span className={`${styles.pie_chart_references}`}>{value}: <b>{entry.payload.alcanzada ? "Alcanzado" : "No Alcanzado"}</b></span>
    }

    async function handleFilterNewsByDates(from, to) {
        const FILTER_DATE = {
            from: from,
            to: to
        }
        setFechaDesdeFiltro(from);
        setFechaHastaFiltro(to);
        const dataCalificaciones = {
            id_objetivo: metricaPromedio?.id,
            id_alumno: alumnoSeleccionado
        }
        const dataAsistencia = {
            id_objetivo: metricaAsistencia?.id,
            id_alumno: alumnoSeleccionado
        }

        if (metricaAsistencia?.id != "") {
            getGoalsProgressionStudentService(user.user.token, dataAsistencia, FILTER_DATE).then((result) => {
                if (result.status === 204) {
                    const asistenciaData = [];
                    const noData = {}
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

        if (metricaPromedio && metricaPromedio?.id != "") {
            getGoalsProgressionStudentService(user.user.token, dataCalificaciones, FILTER_DATE).then((result) => {
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
                        <Col lg={10} md={10} sm={10} xs={10}>
                            {añoActual && <div className={styles.info_message}>Las siguientes métricas y objetivos corresponden al {añoActual.nombre}, el cuál inicia el {fromStoreToViewFormatDate(añoActual.fecha_desde)} y finaliza el {fromStoreToViewFormatDate(añoActual.fecha_hasta)}</div>}
                        </Col>
                    </Row>
                </Row>

                <Col lg={10} md={10} sm={10} xs={10}>
                    <Row lg={12} md={12} sm={12} xs={12} className={styles.container} >



                        {/* SECCIÓN TRES METAS Y OBJETIVOS*/}
                        {<div className={styles.collapse_container}>Metas y Objetivos del seguimiento {thirdSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>}

                        <Collapse in={true} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                            {
                                añoActual && <DateFilter date={añoActual} handleSend={handleFilterNewsByDates} cambioAlumno={cambioAlumnoSeleccionado} />
                            }
                            <Row lg={12} md={12} sm={12} xs={12} className={styles.stats_row_container} id="estadisticas" >

                                <Col lg={5} md={5} sm={5} xs={5} className={`${styles.stats_container} mt-0`}>
                                    <h3 className="subtitle mb-2">Progreso Calificaciones</h3>
                                    {calificacionesData.length != 0 ?
                                        <>
                                            <ResponsiveContainer width="100%" height={300} className="mx-auto">
                                                <LineChart
                                                    data={calificacionesData}
                                                    className="mb-3"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="fecha" label={{ value: 'Fecha', position: 'insideBottom', offset: -5 }}>

                                                    </XAxis>
                                                    <YAxis type="number" domain={[4, 10]} label={{ value: 'Calificación', angle: -90, position: 'insideLeft' }} />
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
                                <Col lg={5} md={5} sm={5} xs={5} className={`${styles.stats_container} mt-0`}>
                                    <h3 className="subtitle mb-2">Progreso Asistencias</h3>
                                    {asistenciasData.length != 0 ?
                                        <>
                                            <ResponsiveContainer width="100%" height={300} className="mx-auto">
                                                <LineChart
                                                    data={asistenciasData}
                                                    className="mb-3"
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="fecha" label={{ value: 'Fecha', position: 'insideBottom', offset: -5 }}>

                                                    </XAxis>
                                                    <YAxis type="number" domain={[0, 100]} label={{ value: 'Asistencia', angle: -90, position: 'insideLeft' }} />
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
                                    <h3 className="subtitle mb-2">Objetivos Cualitativos</h3>
                                    {objetivosCualitativosData.length != 0 ?
                                        <>
                                            <ResponsiveContainer width="60%" height={300} className="mx-auto">
                                                <PieChart>
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Legend verticalAlign="bottom" formatter={formatterdata} />
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
                    </Row>
                    <Col lg={12} md={12} sm={12} xs={12} style={{ margin: '20px 0px 20px 0px' }}>
                        <button className="ontrack_btn add_btn" onClick={handlePrintPage2}>Generar Reporte</button>
                    </Col>

                </Col>
            </Row>
        </Row>
    )
}

export default Estadisticas;