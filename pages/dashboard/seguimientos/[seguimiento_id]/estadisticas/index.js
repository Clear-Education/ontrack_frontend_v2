import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from './styles.module.css';

//MATERIAL UI
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormControl, InputLabel } from "@material-ui/core";
import { getGoalsProgressionStudentService } from '../../../../../src/utils/goals/services/goals_services';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label
} from 'recharts';


const Estadisticas = () => {

    const [metricas, setMetricas] = useState([]);
    const [metricaPromedio, setMetricaPromedio] = useState(null);
    const [metricaAsistencia, setMetricaAsistencia] = useState(null);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
    const [progresoAsistencias, setProgresoAsistencias] = useState([]);
    const [progresoCalificaciones, setProgresoCalificaciones] = useState([]);
    const [calificacionesData, setCalificacionesData] = useState([]);
    const [asistenciasData, setAsistenciasData] = useState([]);

    const tracking = useSelector((store) => store.tracking);
    const user = useSelector((store) => store.user);

    useEffect(() => {
        if (tracking.asistencia) {
            setMetricaAsistencia(tracking.asistencia);
        }
        if (tracking.promedio) {
            setMetricaPromedio(tracking.promedio)
        }
    }, [])

    useEffect(() => {
        if (alumnoSeleccionado != "") {
            if (metricaAsistencia) {
                const dataAsistencia = {
                    id_objetivo: metricaAsistencia.id,
                    id_alumno: alumnoSeleccionado
                }
                getGoalsProgressionStudentService(user.user.token, dataAsistencia).then((result) => {
                    setProgresoAsistencias(result.result.results);
                })
            }

            /*    if (metricaPromedio) {
                   const dataCalificaciones = {
                       id_objetivo: metricaPromedio.id,
                       id_alumno: alumnoSeleccionado
                   }
                   getGoalsProgressionStudentService(user.user.token, dataCalificaciones).then((result) => {
                       setProgresoCalificaciones(result.result.results);
                   })
               } */
        }
    }, [alumnoSeleccionado])

    useEffect(() => {
        let progresoAsistenciasAlumno = []
        progresoAsistencias.map((progreso) => {
            const data = {
                porcentaje_asistencias: Number.parseFloat(progreso.valor * 100).toFixed(2)
            }

            progresoAsistenciasAlumno.push(data);
        })


        setAsistenciasData(progresoAsistenciasAlumno);

    }, [progresoAsistencias])

    useEffect(() => {
        let progresoCalificacionesAlumno = []
        progresoCalificaciones.map((progreso) => {
            const data = {
                promedio_calificaciones: progreso.valor
            }

            progresoCalificacionesAlumno.push(data);
        })


        setCalificacionesData(progresoCalificacionesAlumno);

    }, [progresoCalificaciones])


    const handleChangeAlumno = (data) => {
        setAlumnoSeleccionado(data);
    }

    return (
        <div>
            <h1>Estadísticas</h1>
            <p>En esta sección puede observar como es el progreso de los alumnos en las métricas definidas para el seguimiento.</p>
            <div className="mx-auto w-50 ">
                <b>Información General del Seguimiento</b>
                <ul className="border rounded text-left pt-2 pb-2">
                    <li>Nombre: {tracking.nombre}</li>
                    <li>Descripción:{tracking.descripcion}</li>
                    <li>Alumnos:</li>
                    <ul>
                        {tracking.alumnos.map(alumno => {
                            return <li>{alumno.nombre} {alumno.apellido}</li>
                        })
                        }
                    </ul>
                    <li>Participantes:</li>
                    <ul>
                        {tracking.integrantes.map(integrante => {
                            return <li>{integrante.nombre} {integrante.apellido} ({integrante.rol})</li>
                        })
                        }
                    </ul>
                    <li>Fecha de Inicio: {tracking.fecha_desde}</li>
                    <li>Fecha de cierre: {tracking.fecha_hasta}</li>
                    <li>Materias:</li>
                    <ul>
                        {tracking.materias.map(materia => {
                            return <li>{materia.subject_name}</li>
                        })}
                    </ul>
                    <li>Objetivos:</li>
                    <ul>
                        {tracking.cualitativos.map(obj => {
                            return <li>{obj.descripcion}</li>
                        })
                        }
                    </ul>
                    <li>Métricas:</li>
                    <ul>
                        {tracking.promedio && <li>Promedio Calificaciones: {tracking.promedio.value}</li>}
                        {tracking.asistencia && <li>Porcentaje Asistencias: {tracking.asistencia.value} %</li>}
                    </ul>
                </ul>

            </div>
            <p>A continuación seleccione un alumno para verificar su progreso.</p>
            <div className="w-50 mx-auto mb-5">
                <FormControl>
                    <InputLabel id="alumno">Alumno</InputLabel>
                    <Select
                        labelId="alumno"
                        id="alumno"
                        value={alumnoSeleccionado}
                        onChange={(e) => handleChangeAlumno(e.target.value)}
                    >
                        {
                            tracking.alumnos.map((alumno) => {
                                return (
                                    <MenuItem value={alumno.id} key={alumno.id}>
                                        {alumno.nombre} {alumno.apellido}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>
            </div>

            {metricaPromedio && <h3 className="subtitle mb-2">Calificaciones</h3>}
            {metricaAsistencia && <h3 className="subtitle mb-2">Asistencias</h3>}


            {
                asistenciasData.length != 0 &&
                <ResponsiveContainer width="65%" height={300} className="mx-auto">
                    <LineChart
                        data={asistenciasData}
                        className="mb-3"
                    /*                         margin={{
                                                top: 5, right: 30, left: 20, bottom: 5,
                                            }} */
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name">
                            <Label value="Porcentaje de Asistencias en el Año Lectivo" offset={0} position="insideBottom" />
                        </XAxis>
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <ReferenceLine y={tracking.asistencia.value} label="Objetivo" stroke="red" />
                        <Line type="monotone" dataKey="porcentaje_asistencias" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>

            }
        </div >
    )
}

export default Estadisticas;