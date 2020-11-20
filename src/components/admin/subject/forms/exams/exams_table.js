import MaterialTable from "material-table";
import { useState, useEffect } from "react";
import styles from './styles.module.css'
import { useSelector } from "react-redux";
import { getExamsService, editExamsService, deleteExamsService } from "../../../../../utils/exam/services/exam_services";
import { getOneSchoolYearService } from "../../../../../utils/school_year/services/school_year_services";
import { Col } from "react-bootstrap";
import CircularProgress from "@material-ui/core/CircularProgress";
import MTConfig from "../../../../../utils/table_options/MT_config";
import TextField from '@material-ui/core/TextField';
import { fromApiToDateInputFormatDate, fromStoreToViewFormatDate, convertFormatToDatePicker } from '../../../../../utils/commons/common_services'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const ExamsTable = (props) => {

    const [selectedSubject, setSelectedSubject] = useState(props.subject)
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(props.schoolYear)
    const [selectedExams, setSelectedExams] = useState()
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState()
    const [examsArray, setExamsArray] = useState([]);
    const [ponderacion, setPonderacion] = useState(0);
    const [schoolYearData, setSchoolYearData] = useState();

    const [nameError, setNameError] = React.useState({
        error: false,
        label: "",
        helperText: "",
        validateInput: false
    });

    const [ponderacionError, setPonderacionError] = React.useState({
        error: false,
        label: "",
        helperText: "",
        validateInput: false
    });

    const [fechaError, setFechaError] = React.useState({
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
            title: 'Fecha Exámen', field: 'fecha', type: 'date', editComponent: props => (
                <DatePicker
                    format="dd/MM/yyyy"
                    value={props.value || null}
                    onChange={props.onChange}
                    clearable
                    InputProps={{
                        style: {
                            fontSize: 13,
                        }
                    }}
                    minDate={new Date(schoolYearData.fecha_desde)}
                    maxDate={new Date(schoolYearData.fecha_hasta)}
                    invalidDateMessage="Formato de fecha inválido"
                    minDateMessage="La fecha seleccionada es menor a la fecha de inicio del año lectivo"
                    maxDateMessage="La fecha seleccionada es mayor a la fecha de fin del año lectivo"
                    required
                    error={
                        !props.value && fechaError.validateInput && props.rowData.submitted
                            ? fechaError.error
                            : false
                    }
                    helperText={
                        !props.value && fechaError.validateInput && props.rowData.submitted
                            ? fechaError.helperText
                            : ""
                    }
                />
            )
        },
        {
            title: 'Ponderación', field: 'ponderacion', type: 'numeric', editComponent: (props) => (
                <TextField
                    type="number"
                    error={
                        ponderacionError.validateInput && props.rowData.submitted
                            ? ponderacionError.error
                            : false
                    }
                    helperText={
                        ponderacionError.validateInput && props.rowData.submitted
                            ? ponderacionError.helperText
                            : ""
                    }
                    value={props.value ? props.value : ""}
                    onChange={(e) => {
                        if (ponderacionError.validateInput) {
                            setPonderacionError({
                                ...ponderacionError,
                                validateInput: false
                            });
                        }

                        props.onChange(e.target.value);
                    }}
                />
            )
        },
    ];


    useEffect(() => {
        if (examsArray) {
            checkWeighing(examsArray)
        }
    }, [examsArray])


    const filterData = (data) => {
        let selectedExamsCopy = [];
        if (!!data.length) {
            selectedExamsCopy = data.filter((element) => {
                return element.anio_lectivo === props.schoolYear;
            });
        }
        setSelectedExams(selectedExamsCopy);
    };

    useEffect(() => {
        if (selectedSchoolYear) {
            getOneSchoolYearService(user.user.token, selectedSchoolYear).then((result) => {
                let añoLectivo = result.result;
                añoLectivo.fecha_desde = convertFormatToDatePicker(añoLectivo.fecha_desde);
                añoLectivo.fecha_hasta = convertFormatToDatePicker(añoLectivo.fecha_hasta);
                setSchoolYearData(añoLectivo);
            })
        }
    }, [selectedSchoolYear])

    useEffect(() => {
        setSelectedSchoolYear(props.schoolYear)
        getExamsService(user.user.token, selectedSubject.id, props.schoolYear).then((result) => {
            setIsLoading(false)
            setExamsArray(result.result)
        })
    }, [props.schoolYear]);

    useEffect(() => {
        if (selectedSchoolYear) {
            setSelectedSchoolYear(props.schoolYear)
            getExamsService(user.user.token, selectedSubject.id, props.schoolYear).then((result) => {
                setIsLoading(false)
                result.result.map((exam) => {
                    if (exam.fecha) {
                        exam.fecha = fromApiToDateInputFormatDate(exam.fecha);
                    }
                })
                setExamsArray(result.result)
            })
        }
    }, [selectedSchoolYear]);

    useEffect(() => {
        filterData(examsArray)
    }, [examsArray]);

    useEffect(() => {
        filterData(examsArray)
    }, [examsArray]);

    async function addExam(data) {
        let newExam = {
            nombre: data.nombre,
            ponderacion: data.ponderacion,
            fecha: data.fecha,
            materia: selectedSubject.id,
            anio_lectivo: selectedSchoolYear
        }
        let newExamsArray = [...examsArray];
        newExamsArray.push(newExam);
        checkWeighing(newExamsArray);
        setExamsArray(newExamsArray);
        return;
    }


    async function editExam(data, oldData) {
        let editedExam = examsArray.filter((exam) => {
            return exam.tableData.id == oldData.tableData.id
        })
        editedExam[0].nombre = data.nombre;
        editedExam[0].ponderacion = data.ponderacion;
        editedExam[0].fecha = data.fecha;
        examsArray.map((exam) => {
            if (exam.id === editedExam.id) {
                exam = { ...editedExam[0] };
            }
        })
        return
    }

    async function deleteExam(data) {
        let newExamsArray = !!examsArray && examsArray.filter((exam) => { return exam.tableData.id !== data.tableData.id })
        if (!newExamsArray.length) {
            newExamsArray = {
                anio_lectivo: selectedSchoolYear,
                materia: selectedSubject.id,
            }
        }
        checkWeighing(newExamsArray);
        setExamsArray(newExamsArray);
        return
    }


    const handleExams = () => {
        setIsLoading(true);
        if (!!examsArray.length) {
            editExamsService(user.user.token, examsArray).then((result) => {
                setIsLoading(false);
                parseExams();
            })
        } else {
            deleteExamsService(user.user.token, examsArray).then((result) => {
                setIsLoading(false);
                parseExams();
            })
        }

    }


    const parseExams = () => {
        getExamsService(user.user.token, selectedSubject.id, props.schoolYear).then((result) => {
            setIsLoading(false)
            result.result.map(exam => {
                exam.fecha = fromApiToDateInputFormatDate(exam.fecha);
            })
            setExamsArray(result.result);
        })
    }


    const checkWeighing = (examArray) => {
        const arrayList = examArray ? examArray : examsArray;
        let ponderacion = 0;
        arrayList.forEach(exam => {
            ponderacion = Math.round((parseFloat(ponderacion) + parseFloat(exam.ponderacion)) * 100) / 100;

        });
        setPonderacion(ponderacion == 1);
        //setPonderacion(ponderacion.toPrecision(1) === "1")
    }

    return (
        <>
            {selectedSchoolYear && selectedSchoolYear !== 'Seleccionar' ?
                <>
                    <div className={styles.message_alert}>
                        Recuerde que los cambios se hacen efectivos una vez que hace click en "Guardar exámenes"
                    </div>
                    <MaterialTable
                        title={<span style={{ position: 'absolute', top: '25px', fontWeight: 600 }}>Exámenes</span>}
                        columns={columnsHeader}
                        data={selectedExams}
                        options={MTConfig("Exámenes").options}
                        components={MTConfig("Exámenes").components}
                        localization={MTConfig("Exámenes").localization}

                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        if (!newData.nombre || (!newData.ponderacion || !(newData.ponderacion > 0 && newData.ponderacion <= 1)) || !newData.fecha) {
                                            if (!newData.nombre) {
                                                newData.submitted = true;
                                                setNameError({
                                                    error: true,
                                                    label: "required",
                                                    helperText: "El nombre de la evaluacion es requerido.",
                                                    validateInput: true
                                                });
                                            }
                                            if (!newData.ponderacion || !(newData.ponderacion > 0 && newData.ponderacion <= 1)) {
                                                newData.submitted = true;
                                                setPonderacionError({
                                                    error: true,
                                                    label: "required",
                                                    helperText: "Una ponderación entre 0 y 1 es requerida.",
                                                    validateInput: true
                                                });
                                            }
                                            if (!newData.fecha) {
                                                newData.submitted = true;
                                                setFechaError({
                                                    error: true,
                                                    label: "required",
                                                    helperText: "La fecha del exámen es requerido.",
                                                    validateInput: true
                                                });
                                            }

                                            reject();
                                            return
                                        }
                                        resolve()
                                        return addExam(newData).then(() => {
                                            return
                                        })
                                    }, 600)
                                })
                            ,
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        if (!newData.nombre || (!newData.ponderacion || !(newData.ponderacion > 0 && newData.ponderacion <= 1)) || !newData.fecha) {
                                            if (!newData.nombre) {
                                                newData.submitted = true;
                                                setNameError({
                                                    error: true,
                                                    label: "required",
                                                    helperText: "El nombre de la evaluacion es requerido.",
                                                    validateInput: true
                                                });
                                            }
                                            if (!newData.ponderacion || !(newData.ponderacion > 0 && newData.ponderacion <= 1)) {
                                                newData.submitted = true;
                                                setPonderacionError({
                                                    error: true,
                                                    label: "required",
                                                    helperText: "Una ponderación entre 0 y 1 es requerida.",
                                                    validateInput: true
                                                });
                                            }

                                            reject();
                                            return
                                        }
                                        resolve()
                                        return editExam(newData, oldData).then(() => {
                                            checkWeighing();
                                            return
                                        })
                                    }, 600)
                                }),

                            onRowDelete: oldData =>
                                deleteExam(oldData).then(() => {
                                    return
                                }),
                        }}
                    />

                    <Col lg={12} md={12} sm={12} xs={12} className={styles.input_container}>
                        {!ponderacion && ponderacion !== 0 && <div className={styles.message_alert}>Las ponderaciones deben sumar 1</div>}
                        {!isLoading ?
                            <button
                                className="ontrack_btn_modal ontrack_btn add_btn"
                                type="button"
                                onClick={handleExams}
                                disabled={!ponderacion}
                            >
                                Guardar Exámenes
                            </button>
                            :
                            <button className="ontrack_btn_modal ontrack_btn add_btn" disabled>
                                <CircularProgress
                                    size={18}
                                    color="primary"
                                />
                                {" "}Guardando...
                            </button>
                        }
                    </Col>
                </>
                :
                <h4 style={{ color: 'rgb(154 154 154)' }}>Seleccione un año lectivo para configurar los exámenes</h4>
            }
        </>

    )
}

export default ExamsTable;