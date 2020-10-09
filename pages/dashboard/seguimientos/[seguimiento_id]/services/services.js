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