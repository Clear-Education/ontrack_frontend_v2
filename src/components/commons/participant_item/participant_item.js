import styles from './styles.module.scss';

const ParticipantItem = ({ integrantes }) => {

    return (
        integrantes.map((integrante) => {
            return (
                <div className={styles.container}>
                    <span>{integrante.usuario.name} {integrante.usuario.lsat_name}</span> - <span>{integrante.rol}</span>
                </div>
            )

        })
    )
}

export default ParticipantItem;