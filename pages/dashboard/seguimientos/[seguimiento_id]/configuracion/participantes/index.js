import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './styles.module.scss';
import Alert from "react-s-alert";
import { Row, Col } from 'react-bootstrap';

//ICONS
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

//REDUX TYPES
import * as types from '../../../../../../redux/types'

import FifthStepParticipants from '../../../../../../src/components/tracking/5_step_participants/fifth_step_participants';
import SixthStepRoles from '../../../../../../src/components/tracking/6_step_roles/sixth_step_roles';
import TitlePage from '../../../../../../src/components/commons/title_page/title_page';
import { editTrackingParticipants } from '../../../../../../src/utils/tracking/services/tracking_services';
import { useRouter } from 'next/router';


const ColorlibConnector = withStyles({
    alternativeLabel: {
        top: 22,
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,var(--orange),var(--orange))',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,var(--main-color-dark),var(--main-color-dark))',
        },
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: 'var(--medium-gray)',
        borderRadius: 1,
    },
})(StepConnector);


function ColorlibStepIcon(props) {
    const { active, completed } = props;

    const icons = {
        1: <GroupAddIcon />,
        2: <SupervisorAccountIcon />,
    };

    return (
        <div
            className={clsx(styles.icon_container, active ? styles.active_icon : completed ? styles.completed_icon : null)}
        >
            {icons[String(props.icon)]}
        </div>
    );
}



function getSteps() {
    return [
        'Integrantes',
        'Roles',
    ];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Seleccione integrantes del seguimiento';
        case 1:
            return 'Defina los roles de los integrantes';
        default:
            return 'Unknown step';
    }
}


const INITIAL_TRACKING_DATA = {
    current_step: 0,
    integrantes: [],
}

const EditParticipants = () => {
    const [isLoading, setIsLoading] = useState(false);
    const steps = getSteps();
    const user = useSelector((store) => store.user);
    const tracking = useSelector((store) => store.tracking);
    const [globalTrackingData, setGlobalTrackingData] = useState(tracking);
    const [activeStep, setActiveStep] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();


    const handleGlobalState = (name, value) => {
        setGlobalTrackingData({ ...globalTrackingData, [name]: value })
    }

    const validateEmptyData = (name) => {
        if (name === 'role') {
            let roles;
            for (let index = 0; index < tracking.integrantes.length; index++) {
                roles = tracking.integrantes[index].role;
                if (roles === undefined || roles === '') {
                    break
                };
            }
            return !(roles === undefined || roles === '');
        }
    }
    const handleValidateData = () => {
        switch (activeStep) {
            case 0:
                return globalTrackingData.integrantes.length > 1
            case 1:
                return validateEmptyData('role');
            default:
                return true
        }
    }

    const handleNext = () => {
        const validateData = handleValidateData();
        if (validateData) {

            switch (activeStep) {

                case steps.length - 1:
                    handleEditParticipants()
                    break;
                default:
                    saveTrackingDataToStore();
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                    break;
            }
        } else {
            Alert.error("Hay campos requeridos vacíos o que presentan errores", {
                effect: "stackslide",
            });
        }

    };

    const handleEditParticipants = () => {
        saveTrackingDataToStore();
        setIsLoading(true);
        let dataToSend = [];
        tracking.integrantes.map((integrante)=>{
            let newData = {
                seguimiento: tracking.id,
                rol: integrante.role,
                usuario: integrante.id
            }
            dataToSend.push(newData);
        });
        editTrackingParticipants(dataToSend,user.user.token).then((result)=>{
            setIsLoading(false);
            if(result.success){
                router.push(`/dashboard/seguimientos/${tracking.id}/configuracion/`)
            }
        })
    }

    const saveTrackingDataToStore = () => {
        const newTrackingData = { ...globalTrackingData, ['current_step']: activeStep + 1 }
        dispatch({ type: types.SAVE_TRACKING_DATA, payload: newTrackingData });
    }

    const handleBack = () => {
        if(activeStep === 0 ){
            router.push(`/dashboard/seguimientos/${tracking.id}/configuracion/`)
        }else{
            const newTrackingData = { ...globalTrackingData, ['current_step']: activeStep - 1 }
            dispatch({ type: types.SAVE_TRACKING_DATA, payload: newTrackingData })
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        }
    };


    return (
        activeStep !== undefined ?
            <>
                <div className={styles.stepper_container}>
                    <Row style={{ margin: '0 5% 0 5%', width: '90%' }}>
                        <TitlePage title="Configurar participantes del seguimiento" />
                        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            {activeStep === steps.length ? (
                                <div>
                                    <Typography>¡Participantes editados correctamente!</Typography>
                                </div>
                            ) : (

                                    <Row lg={12} md={12} sm={12} xs={12}>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <Typography style={{ float: 'left' }}>{getStepContent(activeStep)}</Typography>
                                        </Col>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            {
                                                activeStep === 0 ?

                                                    <FifthStepParticipants
                                                        handleGlobalState={handleGlobalState}
                                                    />
                                                    :
                                                    <SixthStepRoles
                                                        handleGlobalState={handleGlobalState}
                                                    />

                                            }
                                        </Col>

                                        <Col lg={12} md={12} sm={12} xs={12} style={{ marginBottom: 20 }}>
                                            <Button onClick={handleBack}> Volver </Button>
                                            <button
                                                disabled={isLoading}
                                                className={`ontrack_btn ${activeStep !== steps.length - 1 ? 'add_btn' : 'csv_btn'}`}
                                                onClick={handleNext}
                                                style={{ minWidth: '180px' }}
                                            >
                                                {activeStep === steps.length - 1 && !isLoading ? 'Guardar' : !isLoading ? 'Siguiente' : 'Guardando...'}
                                            </button>
                                        </Col>

                                    </Row>

                                )}
                        </Col>
                    </Row>
                </div>
            </>

            : null
    );
}

export default EditParticipants;