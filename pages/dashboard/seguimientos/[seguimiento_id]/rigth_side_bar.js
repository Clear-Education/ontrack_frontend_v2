import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import Link from "next/link";
import GoalsViewer from "../../../../src/components/tracking/view/goals_viewer/goals_viewer";
import StudentViewer from "../../../../src/components/tracking/view/student_viewer/student_viewer";
import GraphicViewer from "../../../../src/components/tracking/view/graphics_viewer/graphic_viewer";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useState } from "react";

const RightSideBar = ({ currentTracking }) => {

    const [selectedStudent, setSelectedStudent] = useState();

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    }

    return (
        <Col lg={3} md={3} sm={3} xs={3} className={styles.container}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                    <span className={styles.section_title}>Alumnos</span>
                    <StudentViewer students={currentTracking?.alumnos} handleSelectStudent={handleSelectStudent} />
                </Col>
            </Row>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                    <span className={styles.section_title}>Plazos</span>
                    <Row lg={12} md={12} sm={12} xs={12} className={styles.container_plazos}>
                        <Col lg={5} md={5} sm={5} xs={5}>
                            <span className={styles.viwer_date}>{currentTracking.fecha_inicio}</span>
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={2}><ArrowForwardIcon style={{ color: 'var(--orange)' }} /></Col>
                        <Col lg={5} md={5} sm={5} xs={5}>
                            <span className={styles.viwer_date}>{currentTracking.fecha_cierre}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                    <span className={styles.section_title}>Objetivos</span>
                    <GoalsViewer student={selectedStudent} tracking={currentTracking} />
                </Col>
            </Row>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                    <span className={styles.section_title}>Métricas</span>
                    <div className="mb-3">
                        <Link href={`/dashboard/seguimientos/${currentTracking?.id}/estadisticas`}><a >Ver Estadisticas</a></Link>
                    </div>
                    <GraphicViewer student={selectedStudent} tracking={currentTracking} />

                </Col>
            </Row>
        </Col>
    )
}

export default RightSideBar;