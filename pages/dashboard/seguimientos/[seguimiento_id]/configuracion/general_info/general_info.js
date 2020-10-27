import styles from './styles.module.scss';
import { Col } from "react-bootstrap";
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import TitlePage from '../../../../../../src/components/commons/title_page/title_page';
import { editTrackingService } from '../../../../../../src/utils/tracking/services/tracking_services';
import { useDispatch, useSelector } from 'react-redux';
import { convertDate2, convertDateFromStoreToSend } from '../../../../../../src/utils/commons/common_services';
import * as types from "../../../../../../redux/types";
import { useState } from 'react';
import { IconButton } from '@material-ui/core';

const GeneralInfo = ({ adminView, titleSection }) => {
    const [editTitle, setEditTitle] = useState();
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store) => store.currentTracking);

    const handleEditTitleSeguimiento = () => {
        if (editTitle) {
            const DATA = {
                id: currentTracking.id,
                nombre: currentTracking.nombre,
                descripcion: currentTracking.descripcion,
                fecha_cierre: currentTracking.fecha_cierre == 'NaN-NaN-NaN' ? "10/10/1900" : convertDateFromStoreToSend(currentTracking.fecha_cierre)
            }
            const validate = validateData('nombre') && validateData('descripcion'); 
            if (validate) {
                editTrackingService(DATA, user.user.token).then((result) => {
                    if (result.success) {
                        setEditTitle(!editTitle);
                    }
                });
            } else {
                Alert.error("Debes completar todos los campos", {
                    effect: "stackslide",
                });
            }

        } else {
            setEditTitle(!editTitle);
        }

    }

    const validateData = (prop) => {
        const value = currentTracking[prop];
        const validate = (value.trim().length > 0);
        return validate;
    }

    const handleChange = (prop, event) => {
        event.preventDefault();
        const DATA = {
            ...currentTracking,
            [prop]: event.target.value
        }
        dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: DATA });
    }

    return (
        <>
            <div className={adminView ? styles.edit_title_icon : styles.display_none}>
                <IconButton onClick={handleEditTitleSeguimiento}>
                    {editTitle ? <DoneIcon /> : <EditIcon />}
                </IconButton>
            </div>

            {!editTitle ?
                <>
                    <TitlePage title={`${titleSection} del seguimiento ${currentTracking.nombre}`} />
                    <Col lg={12} md={12} sm={12} xs={12} className="left" style={{ paddingLeft: '20px' }}>
                        <span>{currentTracking.descripcion}</span>
                    </Col>
                </>
                :
                <div className={styles.edit_header_container}>
                    <input
                        onChange={(e) => handleChange('nombre', e)}
                        value={currentTracking.nombre}
                        className={styles.edit_header_input}
                        autoFocus
                    />
                    <input
                        onChange={(e) => handleChange('descripcion', e)}
                        value={currentTracking.descripcion}
                        className={styles.edit_header_input}
                    />
                </div>
            }
        </>
    )

}

export default GeneralInfo;