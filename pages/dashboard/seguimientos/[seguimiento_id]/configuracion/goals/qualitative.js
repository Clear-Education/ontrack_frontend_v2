import { useDispatch, useSelector } from "react-redux";
import OnlineAddItemList from "../../../../../../src/components/commons/online_add_item_list/online_add_item_list";
import { addGoalsService, deleteGoalsService, getGoalsTypeService } from "../../../../../../src/utils/goals/services/goals_services";
import { motion } from "framer-motion";
import { IconButton } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import { useState } from "react";
import styles from './styles.module.scss';
import DoneIcon from '@material-ui/icons/Done';
import { useEffect } from "react";
import * as types from '../../../../../../redux/types';

const QualitativeGoals = ({ adminView, currentTracking }) => {

    const user = useSelector((store) => store.user);
    const [disabledCualitativos, setDisabledCualitativos] = useState();
    const [qualitativeType, setQualitativeType] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        getGoalsTypeService(user.user.token).then((result) => {
            const QUALITATIVE_TYPE = result.result.find((type) => (type.nombre).toUpperCase() === 'CUALITATIVO')
            setQualitativeType(QUALITATIVE_TYPE);
        })
    }, [])

    const handleEditCualitativos = () => {
        setDisabledCualitativos(!disabledCualitativos)
    }

    const deleteQualitativeGoalFromStore = (goal_id) => {
        let newGoals = currentTracking?.cualitativos.filter((goal) => goal.id !== goal_id);
        const PAYLOAD = {
            ...currentTracking,
            cualitativos: newGoals
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: PAYLOAD })
    }

    const saveQualitativeGoalToStore = (newGoal) => {
        let newGoals = [...currentTracking?.cualitativos];
        newGoals.push(newGoal);
        const PAYLOAD = {
            ...currentTracking,
            cualitativos: newGoals
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: PAYLOAD })
    }
    async function handleOnlineQualitativeGoals(type, data) {
        switch (type) {
            case 'delete':
                const DELETE_DATA = {
                    id: data
                }
                return deleteGoalsService(user.user.token, DELETE_DATA).then((result) => {
                    deleteQualitativeGoalFromStore(DELETE_DATA.id);
                    return result;
                })
            case 'add':
                const ADD_DATA = {
                    descripcion: data,
                    seguimiento: currentTracking.id,
                    tipo_objetivo: qualitativeType.id
                }
                return addGoalsService(user.user.token, ADD_DATA).then((result) => {
                    if (result.success) {
                        const newQualitativeGoal = { id: result.result.id, descripcion: data }
                        saveQualitativeGoalToStore(newQualitativeGoal);
                    }
                    return result;
                })

            default:
                break;
        }
    }

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.goals_header}>
                    <h6 className="left" className={styles.goals_title}>Objetivos:</h6>
                    {adminView &&
                        <IconButton disabled={!currentTracking.en_progreso} onClick={disabledCualitativos ? handleEditCualitativos : () => setDisabledCualitativos(!disabledCualitativos)}>
                            {!disabledCualitativos ? <EditIcon /> : <DoneIcon />}
                        </IconButton>
                    }
                </div>

                <Row>
                    <Col lg={12} md={12} sm={12} xs={12} className={`${styles.input_container}`}>
                        <OnlineAddItemList
                            labelText={"Añade un objetivo"}
                            handleList={handleOnlineQualitativeGoals}
                            previousItems={currentTracking?.cualitativos}
                            editable={!disabledCualitativos}
                        />
                    </Col>
                </Row>
            </motion.div>
        </div>
    )
}

export default QualitativeGoals;