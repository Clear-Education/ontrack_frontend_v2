import { FormControl, FormHelperText, IconButton, OutlinedInput, InputAdornment, FormLabel } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import * as types from '../../../../../../redux/types';
import { addMultipleGoalsService, editGoalsService } from '../../../../../../src/utils/goals/services/goals_services';

const VALIDATE_INITIAL_STATE = {
    promedio: false,
    asistencia: false,
};

const QuantitativeGoals = ({ adminView, goalType }) => {
    const user = useSelector((store) => store.user);
    const [disabled, setDisabled] = useState(true);
    const [errorMsg, setErrorMsg] = useState();
    const [validation, setValidation] = useState(VALIDATE_INITIAL_STATE);
    const currentTracking = useSelector((store) => store.currentTracking);
    const dispatch = useDispatch();

    useEffect(() => {
        let msg;
        if (goalType === 'promedio') {
            msg = "La calificación del alumno debe ser un número comprendido entre 0 y 10."
        } else {
            msg = "La asistencia debe ser un valor de 1 a 100 (%)."
        }
        setErrorMsg(msg);
    }, [goalType]);

    const handleChange = (type) => (event) => {
        const VALUE = event.target.value;
        const PAYLOAD = {
            ...currentTracking,
            [type]: {
                id: event.target.id,
                value: VALUE
            }
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: PAYLOAD });
        hadleValidation(type, VALUE);
    }

    const hadleValidation = (prop, value) => {
        if (prop === "promedio") {
            let puntaje = parseInt(value, 10)
            if (puntaje >= 0 && puntaje <= 10) {
                setValidation({
                    ...validation,
                    [prop]: false
                })
            } else {
                setValidation({
                    ...validation,
                    [prop]: true
                })
            }
        } else {
            setValidation({
                ...validation,
                [prop]: !(value > 0 && value <= 100),
            });
        }
    };

    const updateStore = (goalId) => {
        const newGoal = { ...currentTracking[goalType], id: goalId }
        const PAYLOAD = {
            ...currentTracking,
            [goalType]: newGoal
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: PAYLOAD })
    }

    const handleSaveGoal = (type) => {
        if (currentTracking[type].id !== type) {
            editGoalsService(currentTracking[type], user.user.token).then((result) => {
                if (result.success) {
                    setDisabled(!disabled);
                }
            })
        } else {
            const trackingGoal = {
                id: currentTracking.id,
                [type]: currentTracking[type].value
            }
            addMultipleGoalsService(trackingGoal, user.user.token, true).then((result) => {
                if (result.success) {
                    setDisabled(!disabled);
                    const GOAL_ID = result.result[0].id;
                    updateStore(GOAL_ID);
                }
            });
        }
    }

    return (
        <>
            <FormControl variant="outlined">
                <FormLabel className="left" component="legend">
                    <span style={{ textTransform: 'capitalize' }}>{goalType}</span>: (No requerido)
                </FormLabel>
                <OutlinedInput
                    disabled={disabled}
                    id={currentTracking[goalType]?.id || goalType}
                    name="promedio"
                    variant="outlined"
                    value={currentTracking[goalType]?.value || ''}
                    onChange={handleChange(goalType)}
                    type="number"
                    inputProps={{ min: "0", max: goalType === 'promedio' ? "10" : '100', step: "1" }}
                    required
                    style={{
                        padding: '5px'
                    }}
                    endAdornment={
                        adminView &&
                        <InputAdornment position="end">
                            <IconButton disabled={validation[goalType] || !currentTracking.en_progreso} onClick={!disabled ? () => handleSaveGoal(goalType) : () => setDisabled(!disabled)}>
                                {disabled ? <EditIcon /> : <DoneIcon />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            {validation[goalType] && (
                <FormHelperText
                    className="helper-text"
                    style={{ color: "rgb(182, 60, 47)" }}
                >
                    {errorMsg}
                </FormHelperText>
            )}
        </>
    )
}

export default QuantitativeGoals;