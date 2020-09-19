import TitlePage from "../../../src/components/commons/title_page/title_page";
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import Alert from "react-s-alert";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SelectInput from "../../../src/components/commons/select_input/select_input"
import { addMultipleStudentsCourseService, deleteMultipleStudentsCourseService } from "../../../src/utils/student/service/student_service";
import { useSelector } from "react-redux";
import { getActualSchoolYearService } from "../../../src/utils/school_year/services/school_year_services";
import TransferList from "./tranferTable";

const INITIAL_STATE = {
    school_year: '',
    department: '',
    year: '',
    curso: '',
    studentsToAdd: [],
    studentsToDelete: [],
}

const Cursos = () => {

    const [state, setState] = useState(INITIAL_STATE);
    const [isLoading, setIsLoading] = useState();
    const user = useSelector((store) => store.user);

    useEffect(() => {
        getActualSchoolYearService(user.user.token).then((result) => {
            setState({ ...state, school_year: result.result.id });
        })
    }, [])


    const handleChange = (prop, value) => {
        if (prop === 'studentsToAdd') {
            state.studentsToAdd = value;
        } else if (prop === 'studentsToDelete') {
            state.studentsToDelete = value;
        }
        else {
            setState({ ...state, [prop]: value })
        }

    }


    function getSteps() {
        return ['Seleccione la carrera deseada',
            'Seleccione el año deseado',
            'Seleccione el curso deseado',
            'Seleccione los alumnos'
        ];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <SelectInput type="department" data={state} changeAction={handleChange} />
            case 1:
                return <SelectInput type="year" data={state} changeAction={handleChange} />;
            case 2:
                return <SelectInput type="curso" data={state} changeAction={handleChange} />;
            case 3:
                return <TransferList type="Alumnos" data={state} changeAction={handleChange} />;
            default:
                return 'Unknown step';
        }
    }

    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    const handleNext = (type) => {
        if (type !== 'send') {
            if (state[type] !== '') {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
                Alert.error("Debes completar este campo", {
                    effect: "stackslide",
                });
            }
        } else {
            const STUDENTS_DATA = {
                curso: state.curso,
                anio_lectivo: state.school_year,
                studentsToDelete: state.studentsToDelete,
                studentsToAdd: state.studentsToAdd
            }
            setIsLoading(true);
            deleteMultipleStudentsCourseService(user.user.token, STUDENTS_DATA).then((result) => {
                setIsLoading(false);
                if (result.success) {
                    setIsLoading(true);
                    addMultipleStudentsCourseService(user.user.token, STUDENTS_DATA).then((result) => {
                        setIsLoading(false);
                        if (result.success) { setActiveStep((prevActiveStep) => prevActiveStep + 1); }
                    })
                }
            })
        }


    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };



    return (
        <>
            <TitlePage title="Configurar Cursos" />
            <div className={styles.stepper_container}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {getStepContent(index)}
                                <div className={styles.actionsContainer}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={styles.stepper_button}
                                    >
                                        Anterior
                                    </Button>
                                    <button
                                        onClick={() => handleNext(activeStep === 0 ? 'department' : activeStep === 1 ? 'year' : activeStep === 2 ? 'curso' : 'send')}
                                        className={`ontrack_btn csv_btn ${styles.stepper_button}`}
                                    >
                                        {activeStep === steps.length - 1 ? (isLoading  ? 'Guardando...' : 'Finalizar') : 'Siguiente'}
                                    </button>

                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={styles.resetContainer}>
                        <Typography>Todo listo!</Typography>
                        <Button onClick={handleBack} className={styles.stepper_button}>
                            Volver
                        </Button>
                        <Button onClick={handleReset} className={styles.stepper_button}>
                            Resetear
                        </Button>
                    </Paper>
                )}
            </div>
        </>
    );


}


export default Cursos;
