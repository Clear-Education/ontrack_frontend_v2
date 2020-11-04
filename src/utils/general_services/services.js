export const parseGoalsData = (goalsData) => {
    let goals = {
        promedio: {
            id: '',
            value: ''
        },
        asistencia: {
            id: '',
            value: ''
        },
        cualitativos: [],
    }
    goalsData.map((goal) => {
        const GOAL_TYPE = (goal.tipo_objetivo.nombre).toUpperCase();
        if (GOAL_TYPE === 'PROMEDIO') {
            goals.promedio.id = goal.id,
                goals.promedio.value = goal.valor_objetivo_cuantitativo
        }
        if (GOAL_TYPE === 'ASISTENCIA') {
            goals.asistencia.id = goal.id,
                goals.asistencia.value = goal.valor_objetivo_cuantitativo
        }
        if (GOAL_TYPE === 'CUALITATIVO') {
            const DATA = {
                id: goal.id,
                descripcion: goal.descripcion
            }
            goals.cualitativos.push(DATA)
        }
    });

    return goals;
}


export const parseParticipantsToShowOnTable = (participants) =>{
    let newData = [];
    participants.map((participant)=>{
        let NewParticipantsData = {
            nombre: participant.usuario.name,
            apellido:  participant.usuario.last_name,
            rol: participant.rol
        }
        newData.push(NewParticipantsData);
    })

    return newData;
}


export const parseStudentsToShowOnTable = (students) =>{
    let newData = [];
    students.map((student)=>{
        let NewStudentData = {
            nombre: student.alumno.nombre,
            apellido:  student.alumno.apellido,
            legajo: student.alumno.legajo
        }
        newData.push(NewStudentData);
    })

    return newData;
}

export const parseSubjectsToShowOnTable = (subjects) =>{
    let newData = [];
    subjects.map((subject)=>{
        let NewSubjectsData = {
            nombre: subject.nombre,
            carrera: subject.anio.carrera,
            year:  subject.anio.nombre
        }
        newData.push(NewSubjectsData);
    })

    return newData;
}


export const parsePostData = (postData, currentTracking) =>{
    const USER = currentTracking.integrantes.filter((integrante)=>{return integrante.usuario.id === postData?.usuario});
    let newData = {
        ...postData,
        usuario: USER[0],
        seguimiento: currentTracking
    }
    return newData;
}