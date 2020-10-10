import { Collapse, Switch } from "@material-ui/core";
import { changeTrackingStatusService } from "../../../../../../src/utils/tracking/services/tracking_services";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './styles.module.scss';
import { useState } from "react";
import { Col } from "react-bootstrap";
import Modal from "../../../../../../src/components/commons/modals/modal";
import DeleteForm from "../../../../../../src/components/commons/delete_form/deleteForm";
import { useSelector } from "react-redux";

const DangerZone = () => {
    const [trackingStatus, setTrackingStatus] = useState(true);
    const [dangerZone, setDangerZone] = useState();
    const currentTracking = useSelector((store) => store.currentTracking);
    const user = useSelector((store) => store.user);
    
    async function handleConfirmTrackingStatus() {
        const DATA = {
            id: currentTracking.id,
            status: !trackingStatus
        }
        return changeTrackingStatusService(user.user.token, DATA).then((result) => {
            if (result.success) {
                setTrackingStatus(!trackingStatus);
            }
            return result;
        })

    }

    return (
        <>
            <div className={styles.collapse_container}
                onClick={() => setDangerZone(!dangerZone)}>
                Zona de finalización de seguimiento
                 {dangerZone ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Collapse in={dangerZone} timeout="auto" unmountOnExit style={{ width: '100%' }}>
                <Col lg={12} md={12} sm={12} xs={12} className={`${styles.zone_container}`}>
                    <span className={styles.end_label}>{trackingStatus ? 'Finalizar Seguimiento' : 'Seguimiento Finalizado'}</span>
                    <Modal
                        title={`¿Seguro que deseas ${trackingStatus ? 'finalizar' : 'activar '} el seguimiento?`}
                        body={<DeleteForm data={currentTracking} handleSubmitAction={handleConfirmTrackingStatus} labelButton={trackingStatus ? 'Finalizando...' : 'Activando...'} />}
                        button={
                            <Switch
                                checked={!trackingStatus}
                                color="primary"
                                name="checkedB"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                    />
                </Col>
            </Collapse>
        </>
    )

}
export default DangerZone;