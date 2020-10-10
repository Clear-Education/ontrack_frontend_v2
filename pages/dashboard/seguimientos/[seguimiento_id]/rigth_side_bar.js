import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import Link from "next/link";
import GoalsViewer from "../../../../src/components/tracking/view/goals_viewer/goals_viewer";
import StudentViewer from "../../../../src/components/tracking/view/student_viewer/student_viewer";

const RightSideBar = ({currentTracking}) =>{
    return(
        <Col lg={3} md={3} sm={3} xs={3} className={styles.container}>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                        <span className={styles.section_title}>Alumnos</span>
                        <StudentViewer students={currentTracking.alumnos} />
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                        <span className={styles.section_title}>Plazos</span>
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <span className={styles.section_title}>Objetivos</span>
                        <GoalsViewer />
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <span className={styles.section_title}>Métricas</span>
                        <Link href={`/dashboard/seguimientos/${currentTracking.id}/estadisticas`}><a>Ver Estadisticas</a></Link>
                    </Col>
                </Row>
            </Col>
    )
}

export default RightSideBar;