import { useEffect, useState } from "react";
import { getGoalsProgressionStudentService } from "../../../../utils/goals/services/goals_services";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, Label,
} from 'recharts';
import { useSelector } from "react-redux";
import styles from './styles.module.scss';


const GraphicViewer = ({ student, tracking }) => {

    const [metricaPromedio, setMetricaPromedio] = useState(null);
    const [metricaAsistencia, setMetricaAsistencia] = useState(null);
    const [progresoAsistencias, setProgresoAsistencias] = useState([]);
    const [progresoCalificaciones, setProgresoCalificaciones] = useState([]);
    const [calificacionesData, setCalificacionesData] = useState([]);
    const [asistenciasData, setAsistenciasData] = useState([]);

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
        if (student) {

            if (metricaAsistencia.id != "") {
                const dataAsistencia = {
                    id_objetivo: metricaAsistencia.id,
                    id_alumno: student.id
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
                    id_alumno: student.id
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
    }, [student])

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

    const formatterdata = (value, entry, index) => {
        return <span className={`${styles.label}`}>{value}</span>
    }

    return (
        <div>
            {calificacionesData.length != 0 &&
                <div className={styles.container} style={{paddingTop:'15px'}}>
                    <h6 className="subtitle mb-2">Progreso Calificaciones</h6>
                    <ResponsiveContainer width="100%" height={200} className="mx-auto">
                        <LineChart
                            data={calificacionesData}
                            className="mb-3"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name">
                            </XAxis>
                            <YAxis type="number" domain={[4, 10]} />
                            <Tooltip />
                            <Legend formatter={formatterdata} verticalAlign="bottom" align="right" />
                            <ReferenceLine y={tracking.promedio?.value} label="Objetivo" stroke="red"  /* alwaysShow */ ifOverflow="extendDomain" />
                            <Line type="monotone" dataKey="promedio" stroke="#82ca9d" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }

            {asistenciasData.length != 0 &&
                <div className="h-100" className={styles.container}>
                    <h6 className="subtitle mb-2 mt-3">Progreso Asistencias</h6>
                    <ResponsiveContainer width="100%" height={200} className="mx-auto">
                        <LineChart
                            data={asistenciasData}
                            className="mb-3"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name">
                            </XAxis>
                            <YAxis type="number" domain={[0, 100]} />
                            <Tooltip />
                            <Legend formatter={formatterdata} verticalAlign="bottom" align="right" />
                            <ReferenceLine y={tracking.asistencia?.value} label="Objetivo" stroke="red" ifOverflow="extendDomain" />
                            <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            }
        </div>
    )
}

export default GraphicViewer;