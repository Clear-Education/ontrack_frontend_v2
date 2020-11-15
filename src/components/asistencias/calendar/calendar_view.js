import { IconButton, MuiThemeProvider } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStudentsCourseService } from "../../../utils/student/service/student_service";
import MUIDataTable from "mui-datatables"
import MTConfig from "../../../utils/table_options/MT_config";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Link from 'next/link';

const CalendarView = ({ calendarData }) => {
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState();
    const [students, setStudents] = useState();


    useEffect(() => {

        getStudentsCourseService(user.user.token, calendarData.curso, calendarData.school_year).then((result) => {
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
            setStudents(students);
        })

    }, [])

    return (

        <MUIDataTable
            title={"Alumnos del Curso"}
            data={students}
            options={MTConfig("Alumnos").options}
            components={MTConfig().components}
            localization={MTConfig().localization}
            columns={[

                {
                    name: "alumno_curso",
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
                    name: "show",
                    label: "Ver Asistencia",
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (
                                <>
                                    <Link href={`asistencias/${tableMeta.rowData[0]}`}>
                                        <a target="_blank">
                                            <IconButton>
                                                <ArrowForwardIosIcon />
                                            </IconButton>
                                        </a>
                                    </Link>
                                </>
                            )
                        },
                        filter: false
                    },
                }
            ]}
        />


    )
}

export default CalendarView;