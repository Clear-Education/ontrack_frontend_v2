import { useSelector } from "react-redux";
import QualitativeGoals from "./qualitative";
import QuantitativeGoals from './quantitative';
import styles from './styles.module.scss';
import { motion } from "framer-motion";
import { Col, Row } from "react-bootstrap";

const GoalsConfig = ({ adminView }) => {
    const currentTracking = useSelector((store) => store.currentTracking);

    return (
        <>
            <div className={styles.container}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h6 className="left" className={styles.goals_title}>Métricas:</h6>
                    <Row>
                        <Col lg={12} md={12} sm={12} xs={12} className={`${styles.input_container}`}>
                            <Row lg={12} md={12} sm={12} xs={12} style={{ marginLeft: '-10px' }}>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                    <QuantitativeGoals adminView={adminView} goalType={'promedio'} />
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={6}>
                                    <QuantitativeGoals adminView={adminView} goalType={'asistencia'}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </motion.div>
            </div>
            
            <QualitativeGoals adminView={adminView} currentTracking={currentTracking} />
        </>
    )
}

export default GoalsConfig;