import styles from './styles.module.scss';
import { useState } from 'react';

const StudentViewer = ({ handleSelectStudent, students }) => {

    const [selected, setSelected] = useState();

    const STUDENTS_DATA = students && students.map((student) => { return student.alumno });

    const selectStudent = (index, student) => {
        setSelected(index);
        handleSelectStudent(student);
    }

    return (
        <>
            <div className={styles.students_container}>
                {
                    STUDENTS_DATA && STUDENTS_DATA.map((student, index) => {
                        return (
                            <>
                                <div
                                    key={student.id}
                                    onClick={() => { selectStudent(index, student) }}
                                    className={`${styles.student_container} ${index === selected ? styles.selected : ''}`}>
                                    {student.nombre}   {student.apellido}
                                </div>
                            </>
                        )
                    })
                }
            </div>
        </>
    )

}


export default StudentViewer