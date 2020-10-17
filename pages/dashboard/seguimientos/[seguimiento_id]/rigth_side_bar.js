import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import Link from "next/link";
import GoalsViewer from "../../../../src/components/tracking/view/goals_viewer/goals_viewer";
import StudentViewer from "../../../../src/components/tracking/view/student_viewer/student_viewer";
import GraphicViewer from "../../../../src/components/tracking/view/graphics_viewer/graphic_viewer";
import { useEffect, useState } from "react";
import DateViewer from "../../../../src/components/commons/date_viewer/date_viewer";

const RightSideBar = ({ currentTracking }) => {

    const [selectedStudent, setSelectedStudent] = useState();

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    }

    useEffect(()=>{
        if(currentTracking?.alumnos){
            const alumno = currentTracking.alumnos[0].alumno;
            setSelectedStudent(alumno)
        }
    },[])

    return (
        <>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                    <span className={styles.section_title}>Alumnos</span>
                    <StudentViewer students={currentTracking?.alumnos} handleSelectStudent={handleSelectStudent} />
                </Col>
            </Row>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                    <span className={styles.section_title}>Plazos</span>
                    <DateViewer 
                        start={currentTracking?.fecha_inicio} 
                        end={currentTracking?.fecha_cierre} />
                </Col>
            </Row>
            {currentTracking?.cualitativos?.length !== 0 &&
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <span className={styles.section_title}>Objetivos</span>
                        <GoalsViewer student={selectedStudent} tracking={currentTracking} />
                    </Col>
                </Row>
            }
            <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                    <span className={styles.section_title}>Métricas</span>
                    <div className={styles.show_stats_container}>
                        <Link href={`/dashboard/seguimientos/${currentTracking?.id}/estadisticas`}><a className={styles.show_stats}>Ver Estadisticas</a></Link>
                    </div>
                    <GraphicViewer student={selectedStudent} tracking={currentTracking} />
                </Col>
            </Row>
        </>
    )
}

export default RightSideBar;