import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import { Avatar } from "@material-ui/core";
import config from "../../../../../utils/config";
import { useSelector } from "react-redux";

const FatherPreview = ({ postData }) => {

    const father = postData?.usuario?.usuario;
    const tracking = postData?.seguimiento;
    const user = useSelector((store) => store.user);
    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
            <Col lg={1} md={1} sm={1} xs={1} className={styles.avatar_container}>
                <Avatar alt="Remy Sharp"
                    src={user.user.picture ?
                        `${user.user.picture}`
                        :
                        config.default_picture}
                    className={styles.profile_image} />
            </Col>
            <Col lg={11} md={11} sm={11} xs={11} className={styles.header_container}>
                <span className={styles.highlight}>{father.name} {father.last_name}</span> publicó en
                <span className={styles.highlight}>: {tracking.nombre} </span>
                <span className={styles.dot}></span>
                <span className={styles.post_date}> {postData?.fecha_creacion} : </span>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <p className="text-break">
                            {postData?.cuerpo}
                        </p>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default FatherPreview;