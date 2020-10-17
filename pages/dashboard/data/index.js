import { Row, Col } from "react-bootstrap";
import TitlePage from "../../../src/components/commons/title_page/title_page";
import styles from './index.module.css';
import Link from "next/link";
import AttendanceIcon from "../../../src/components/commons/icons/attendance";
import { useState } from "react";
import MarkIcon from "../../../src/components/commons/icons/markIcon";
import CourseIcon from "../../../src/components/commons/icons/course_icon";


const Data = () => {

  const [colorAttendance, setColorAttendance] = useState('var(--main-color-dark)')
  const [colorMark, setColorMark] = useState('var(--main-color-dark)')
  const [colorCourse, setColorCourse] = useState('var(--main-color-dark)')

  const handleMouseEnter = (name) => {
    const color = 'var(--white)';
    setColor(name,color);
  }

  const handleMouseLeave = (name) => {
    const color = 'var(--main-color-dark)';
    setColor(name,color);
  }

  const setColor = (name,color) =>{
    switch (name) {
      case 'attendance':
        setColorAttendance(color)
        break;
      case 'mark':
        setColorMark(color)
        break;
      case 'course':
        setColorCourse(color)
        break;
      default:
        break;
    }
  }


  return (
    <>
      <Row lg={12} md={12} sm={12} xs={12}>
        <Col lg={11} md={11} sm={11} xs={11} style={{ margin: 'auto' }}>
          <TitlePage title="Carga de datos" />
          <div className={styles.structure_container}>
            <Row lg={12} md={12} sm={12} xs={12} style={{ width: '100%' }}>
              <Col lg={4} md={4} sm={4} xs={4}>
                <Link href="/dashboard/asistencias">
                  <div className={styles.item_area_container}
                    onMouseEnter={() => handleMouseEnter('attendance')}
                    onMouseLeave={() => handleMouseLeave('attendance')}
                  >
                    <div className={styles.items_container}>
                      <AttendanceIcon color={colorAttendance} />
                      <p className={styles.item_area_text} style={{ color: `${colorAttendance}` }}> Asistencia </p>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4}>
                <Link href="/dashboard/notas">
                  <div className={styles.item_area_container}
                    onMouseEnter={() => handleMouseEnter('mark')}
                    onMouseLeave={() => handleMouseLeave('mark')}
                  >
                    <div className={styles.items_container}>
                      <MarkIcon color={colorMark} />
                      <p className={styles.item_area_text} style={{ color: `${colorMark}` }}> Notas </p>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4}>
                <Link href="/dashboard/cursos">
                  <div className={styles.item_area_container}
                    onMouseEnter={() => handleMouseEnter('course')}
                    onMouseLeave={() => handleMouseLeave('course')}
                  >
                    <div className={styles.items_container}>
                      <CourseIcon color={colorCourse} />
                      <p className={styles.item_area_text} style={{ color: `${colorCourse}` }}> Cursos </p>
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

    </>
  )

}


export default Data;