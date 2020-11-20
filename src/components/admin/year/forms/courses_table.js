import React from 'react';
import MaterialTable from 'material-table';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { addCoursesService, editCoursesService, deleteCoursesService, getCourseService } from '../../../../utils/course/services/course_services';
import MTConfig from '../../../../utils/table_options/MT_config';
import TextField from '@material-ui/core/TextField'



export default function CoursesTable(props) {
    const [yearCourses, setYearCourses] = useState(props.data.cursos !== [] ? props.data.cursos : []);
    const user = useSelector((store) => store.user);
    const [nameError, setNameError] = React.useState({
        error: false,
        label: "",
        helperText: "",
        validateInput: false
    });
    const columnsHeader = [
        {
            title: 'Nombre', field: 'nombre', editComponent: (props) => (
                <TextField
                    type="text"
                    error={
                        !props.value && nameError.validateInput && props.rowData.submitted
                            ? nameError.error
                            : false
                    }
                    helperText={
                        !props.value && nameError.validateInput && props.rowData.submitted
                            ? nameError.helperText
                            : ""
                    }
                    value={props.value ? props.value : ""}
                    onChange={(e) => {
                        if (nameError.validateInput) {
                            setNameError({
                                ...nameError,
                                validateInput: false
                            });
                        }

                        props.onChange(e.target.value);
                    }}
                />
            )
        },
        {
            title: '', field: 'id', editable: 'never', render: () => null,
            editComponent: props => (
                <TextField
                    type="text"
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                />
            )
        },
    ];

    const [state, setState] = React.useState({
        data:
            props.data.cursos.map((curso) => {
                return {
                    id: curso.id,
                    nombre: curso.nombre
                }
            })
    })

    function getCourses() {
        getCourseService(user.user.token, props.data.id).then(result => {
            setState({
                data:
                    result.result.map(curso => {
                        return {
                            id: curso.id,
                            nombre: curso.nombre
                        }
                    })
            })
        })
    }

    return (
        <MaterialTable
            title={<span
                style={{
                    position: 'absolute',
                    top: '25px',
                    fontWeight: 600
                }}
            >Cursos</span>}
            options={MTConfig("Cursos").options}
            components={MTConfig().components}
            localization={MTConfig().localization}
            columns={columnsHeader}
            data={state.data}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (!newData.nombre) {
                                newData.submitted = true;
                                setNameError({
                                    error: true,
                                    label: "required",
                                    helperText: "El nombre del curso es requerido.",
                                    validateInput: true
                                });
                                reject();
                                return;
                            }

                            resolve();
                            if (newData != "") {
                                const { nombre } = newData;
                                let data = {
                                    nombre,
                                    anio: props.data.id,
                                }
                                return addCoursesService(user.user.token, data).then((result) => {
                                    if (result.success) {
                                        const data = [...state.data]
                                        newData.id = result.result.id
                                        data.push(newData)
                                        setState({ ...state, data })
                                    }
                                })
                            }
                        }, 600)
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            newData.submitted = true;
                            if (!newData.nombre) {
                                setNameError({
                                    error: true,
                                    label: "required",
                                    helperText: "Name is required.",
                                    validateInput: true
                                });
                                reject();
                                return;
                            }
                            resolve();

                            if (newData.nombre) {
                                const { id, nombre } = newData;
                                let data = {
                                    id,
                                    nombre
                                }
                                return editCoursesService(user.user.token, data).then((result) => {
                                    if (result.success) {
                                        const data = [...state.data];
                                        data[data.indexOf(oldData)] = newData;
                                        setState({ ...state, data });
                                    }
                                })
                            }
                        }, 600)
                    }),
                onRowDelete: (oldData) => {
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                    });
                    const { id } = oldData;
                    return deleteCoursesService(user.user.token, id).then(result => {
                        getCourses();
                        return result;
                    })
                },
            }}
        />
    );
}