import { useState, useEffect } from "react";

import FormControl from "@material-ui/core/FormControl";
import { InputLabel, Select, MenuItem } from "@material-ui/core";
import { getYearService } from "../../../utils/year/services/year_services";
import { useSelector } from "react-redux";
import { getDepartmentService } from "../../../utils/department/services/department_services";
import { getCourseService } from "../../../utils/course/services/course_services";
import { getSchoolYearService } from "../../../utils/school_year/services/school_year_services";
import { getSubjectsService } from "../../../utils/subject/services/subject_services";
import { getExamsService } from "../../../utils/exam/services/exam_services";


const INITIAL_STATE = {
    school_year: '',
    department: '',
    year: '',
    curso: '',
    subject: '',
    exam: ''
}
const SelectInput = ({ type, data, changeAction }) => {

    const [renderType, setRenderType] = useState();
    const [state, setState] = useState(data ? data : INITIAL_STATE);
    const user = useSelector((store) => store.user)
    const [departmentData, setDepartmentData] = useState(null)
    const [yearData, setYearData] = useState(null)
    const [courseData, setCourseData] = useState(null)
    const [subjectData, setSubjectData] = useState(null)
    const [examData, setExamData] = useState(null)


    const handleChange = (prop) => (event) => {
        changeAction(prop, event.target.value);
    };

    useEffect(() => {
        setState(data);
    }, [data]);


    useEffect(() => {
        setRenderType(type);
    }, [type])

    useEffect(() => {
        if (type === 'department') {
            getDepartmentService(user.user.token).then((result) => {
                setDepartmentData(result.result)
            })
        }
    }, [])

    useEffect(() => {
        if (state.department !== '' && state.school_year !== '' && type === 'year') {
            getYearService(user.user.token, state.department).then((result) => {
                setYearData(result.result)
            })
        }
    }, [state.school_year])

    useEffect(() => {
        if (state.year !== '' && type === 'curso') {
            getCourseService(user.user.token, state.year).then((result) => {
                setCourseData(result.result)
            })
        }
    }, [state.year])

    useEffect(() => {
        if (state.curso !== '' && type === 'subject') {
            getSubjectsService(user.user.token, state.year).then((result) => {
                setSubjectData(result.result)
            })
        }
    }, [state.curso])

    useEffect(() => {
        if (state.subject !== '' && type === 'exam') {
            getExamsService(user.user.token, state.subject, state.school_year).then((result) => {
                setExamData(result.result);
            })
        }
    }, [state.subject])

    return (
        <>
            {renderType === 'department' ?
                <FormControl variant="outlined">
                    <InputLabel id="department">Carrera</InputLabel>
                    <Select
                        labelId="department"
                        id="department"
                        value={state.department}
                        onChange={handleChange("department")}
                    >
                        <MenuItem value="">
                            <em>Seleccionar</em>
                        </MenuItem>
                        {departmentData && departmentData.map((department) => {
                            return (
                                <MenuItem value={department.id} key={department.id}>{department.nombre}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                : renderType === 'year' ?
                    <FormControl variant="outlined">
                        <InputLabel id="department">Año</InputLabel>
                        <Select
                            labelId="year"
                            id="year"
                            value={state.year}
                            onChange={handleChange("year")}
                            disabled={state.department === ''}
                        >
                            <MenuItem value="">
                                <em>Seleccionar</em>
                            </MenuItem>
                            {yearData && yearData.map((year) => {
                                return (
                                    <MenuItem value={year.id} key={year.id}>{year.nombre}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    : renderType === 'curso' ?
                        <FormControl variant="outlined">
                            <InputLabel id="curso">Curso</InputLabel>
                            <Select
                                labelId="curso"
                                id="curso"
                                value={state.curso}
                                disabled={state.year === ''}
                                onChange={handleChange("curso")}
                            >
                                <MenuItem value="">
                                    <em>Seleccionar</em>
                                </MenuItem>
                                {courseData && courseData.map((course) => {
                                    return (
                                        <MenuItem value={course.id} key={course.id}>{course.nombre}</MenuItem>
                                    )
                                })}

                            </Select>
                        </FormControl>
                        : renderType === 'subject' ?
                            <FormControl variant="outlined">
                                <InputLabel id="subject">Materia</InputLabel>
                                <Select
                                    labelId="subject"
                                    id="subject"
                                    value={state.subject}
                                    onChange={handleChange("subject")}
                                    disabled={state.curso === ''}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar</em>
                                    </MenuItem>
                                    {subjectData && subjectData.map((subject) => {
                                        return (
                                            <MenuItem value={subject.id} key={subject.id}>{subject.nombre}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            :
                            <FormControl variant="outlined">
                                <InputLabel id="exam">Exámen</InputLabel>
                                <Select
                                    labelId="exam"
                                    id="exam"
                                    value={state.exam}
                                    disabled={state.subject === ''}
                                    onChange={handleChange("exam")}
                                >
                                    <MenuItem value="">
                                        <em>Seleccionar</em>
                                    </MenuItem>
                                    {examData && examData.map((exam) => {
                                        return (
                                            <MenuItem value={exam.id} key={exam.id}>{exam.nombre}</MenuItem>
                                        )
                                    })}

                                </Select>
                            </FormControl>
            }

        </>

    )
}

export default SelectInput