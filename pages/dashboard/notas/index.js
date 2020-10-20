import TitlePage from "../../../src/components/commons/title_page/title_page";
import styles from './styles.module.scss'
import { useEffect, useState } from "react";
import Alert from "react-s-alert";

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import SelectInput from "../../../src/components/commons/select_input/select_input"
import StudentTable from "./studentTable";
import { addNotasService, editNotasService, deleteNotasService } from "../../../src/utils/notas/services/notas_services";
import { useSelector } from "react-redux";
import { getActualSchoolYearService } from "../../../src/utils/school_year/services/school_year_services";
import Modal from '../../../src/components/commons/modals/modal';
import CSVForm from "../../../src/components/notas/add_csv_form";

const INITIAL_STATE = {
    department: '',
    school_year: '',
    year: '',
    curso: '',
    subject: '',
    exam: ''
}

const Notas = () => {

    const [state, setState] = useState(INITIAL_STATE);
    const user = useSelector((store) => store.user);

    useEffect(() => {
        getActualSchoolYearService(user.user.token).then((result) => {
            setState({ ...state, school_year: result.result.id });
        })
    }, [])

    async function addnotas(e, data) {
        e.preventDefault();
        return await addNotasService(user.user.token, data).then((result) => {
            return result;
        })
    }

    async function editnotas(e, data) {
        e.preventDefault();
        return await editNotasService(user.user.token, data).then((result) => {
            return result;
        })
    }

    async function deletenotas(e, data) {
        e.preventDefault();
        return await deleteNotasService(user.user.token, data).then((result) => {
            return result;
        })
    }


    const handleChange = (prop, value) => {
        setState({ ...state, [prop]: value })
    }

    function getSteps() {
        return ['Seleccione la carrera deseada',
            'Seleccione el año deseado',
            'Seleccione el curso deseado',
            'Seleccione la materia deseada',
            'Seleccione el examen deseado',
            'Seleccione los alumnos'
        ];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <SelectInput type="department" data={state} changeAction={handleChange} />
            case 1:
                return <SelectInput type="year" data={state} changeAction={handleChange} show_school_year={false} />;
            case 2:
                return <SelectInput type="curso" data={state} changeAction={handleChange} />;
            case 3:
                return <SelectInput type="subject" data={state} changeAction={handleChange} />;
            case 4:
                return <SelectInput type="exam" data={state} changeAction={handleChange} />;
            case 5:
                return <StudentTable
                    type="Alumnos"
                    data={state}
                    handleAdd={addnotas}
                    handleEdit={editnotas}
                    handleDelete={deletenotas} />;
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
            setActiveStep(handleReset)
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
            <TitlePage title="Agregar Calificaciones" />
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
                                        onClick={() => handleNext(activeStep === 0 ? 'department' : activeStep === 1 ? 'year' : activeStep === 2 ? 'curso' : activeStep === 3 ? 'subject' : activeStep === 4 ? 'exam' : 'send')}
                                        className={`ontrack_btn csv_btn ${styles.stepper_button}`}
                                    >
                                        {activeStep === steps.length - 1 ? 'Volver al Inicio' : 'Siguiente'}
                                    </button>

                                </div>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </>
    )

}


export default Notas;

