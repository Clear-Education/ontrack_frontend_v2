import styles from './styles.module.scss';

const SubjectItem = ({ materias }) => {

    return (
        materias.map((materia) => {
            return (
                <div className={styles.container}>
                    <span>{materia.nombre} </span> - <span> {materia.anio.nombre} </span> - <span> {materia.anio.carrera}</span>
                </div>
            )

        })
    )
}

export default SubjectItem;