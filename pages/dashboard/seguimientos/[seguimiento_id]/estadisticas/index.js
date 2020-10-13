import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from './styles.module.css';

//MATERIAL UI
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl, InputLabel } from "@material-ui/core";
import { getGoalsProgressionStudentService, getStudentGoalsService } from '../../../../../src/utils/goals/services/goals_services';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label, PieChart, Pie, Sector, Cell, LabelList
} from 'recharts';
import SubMenu from '../../../../../src/components/commons/sub_menu/sub_menu';


const getIntroOfPage = () => {
    return
}

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
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
    const [progresoAsistencias, setProgresoAsistencias] = useState([]);
    const [progresoCalificaciones, setProgresoCalificaciones] = useState([]);
    const [calificacionesData, setCalificacionesData] = useState([]);
    const [asistenciasData, setAsistenciasData] = useState([]);

    const [estadoObjetivosCualitativos, setEstadoObjetivosCualitativos] = useState([]);
    const [objetivosCualitativosData, setObjetivosCualitativosData] = useState([]);

    const tracking = useSelector((store) => store.currentTracking);
    const user = useSelector((store) => store.user);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#8884d8", "#82ca9d", "#B04A75", "#64C9B8", "#EAF08C", "#593EEE"];


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

            if (metricaAsistencia.id != "") {
                const dataAsistencia = {
                    id_objetivo: metricaAsistencia.id,
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

            if (metricaPromedio.id != "") {
                const dataCalificaciones = {
                    id_objetivo: metricaPromedio.id,
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
        <div className="mb-4">
            <div className={styles.sub_menu_container}>
                <SubMenu />
            </div>
            <h1>Estadísticas</h1>
            <p>En esta sección puede observar como es el progreso de los alumnos en las métricas definidas para el seguimiento.</p>
            <div className="mx-auto w-50 mb-5">
                <b>Información General del Seguimiento</b>
                <ul className="border rounded text-left pt-2 pb-2">
                    <li>Nombre: {tracking.nombre}</li>
                    <li>Descripción: {tracking.descripcion}</li>
                    <li>Alumnos:</li>
                    <ul>
                        {tracking.alumnos.map((alumno, i) => {
                            return <li key={i}>
                                {alumno.alumno.nombre} {alumno.alumno.apellido}
                            </li>
                        })
                        }
                    </ul>
                    <li>Participantes:</li>
                    <ul>
                        {tracking.integrantes.map((integrante, i) => {
                            return <li key={i}>
                                {integrante.usuario.name} {integrante.usuario.last_name} ({integrante.rol})
                                </li>
                        })
                        }
                    </ul>
                    <li>Fecha de Inicio: {tracking.fecha_inicio}</li>
                    <li>Fecha de cierre: {tracking.fecha_cierre}</li>
                    <li>Materias:</li>
                    <ul>
                        {tracking.materias.map((materia, i) => {
                            return <li key={i}>
                                {materia.nombre}
                            </li>
                        })}
                    </ul>
                    <li>Objetivos:</li>
                    <ul>
                        {tracking.cualitativos.map((obj, i) => {
                            return <li key={i}>{obj.descripcion}</li>
                        })
                        }
                    </ul>
                    <li>Métricas:</li>
                    <ul>
                        {tracking.promedio.id != "" && <li>Promedio Calificaciones: {tracking.promedio.value}</li>}
                        {tracking.asistencia.id != "" && <li>Porcentaje Asistencias: {tracking.asistencia.value} %</li>}
                    </ul>
                </ul>

            </div>
            <p>A continuación seleccione un alumno para verificar su progreso.</p>
            <div className="w-50 mx-auto">
                <FormControl>
                    <InputLabel id="alumno">Alumno</InputLabel>
                    <Select
                        labelId="alumno"
                        id="alumno"
                        value={alumnoSeleccionado}
                        onChange={(e) => handleChangeAlumno(e.target.value)}
                    >
                        {
                            tracking.alumnos.map((alumno, i) => {
                                return (
                                    <MenuItem value={alumno.alumno.id} key={i}>
                                        {alumno.alumno.nombre} {alumno.alumno.apellido}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>


            {objetivosCualitativosData.length != 0 &&
                <div>
                    <h3 className="subtitle mb-2 mt-5">Objetivos Cualitativos</h3>
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
                </div>
            }

            {calificacionesData.length != 0 &&
                <div>
                    <h3 className="subtitle mb-2">Progreso Calificaciones</h3>
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
                </div>
            }


            {asistenciasData.length != 0 &&
                <div>
                    <h3 className="subtitle mb-2 mt-3">Progreso Asistencias</h3>
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
                </div>

            }
        </div >
    )
}

export default Estadisticas;