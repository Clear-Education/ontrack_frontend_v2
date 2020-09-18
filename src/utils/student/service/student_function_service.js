export const parseStudentCourseData = (studentData,parseType) =>{
    const {anio_lectivo, curso} = studentData;
    const arrayToParse = parseType === 'delete' ? studentData.studentsToDelete : studentData.studentsToAdd;
    let parsedStudentData = [];
    arrayToParse.map((student)=>{
        let newStudentData = {
            alumno: student.id,
            curso: curso,
            anio_lectivo: anio_lectivo
        }
        parsedStudentData.push(newStudentData);
    });

    return parsedStudentData;
}