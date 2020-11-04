import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import { Avatar } from "@material-ui/core";
import config from "../../../../../utils/config";
import { useSelector } from "react-redux";
import FatherPreview from "./father_preview";
import NewPost from "../../new_post/new_post";

const AnswerInput = ({ postData, handleSubmitPost, handleModal }) => {

    const father = postData?.usuario?.usuario;
    const parent_post = postData?.id;
    const user = useSelector((store) => store.user);
    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
            <Col lg={12} md={12} sm={12} xs={12}>
                <FatherPreview postData={postData} />
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.answer_container}>
                    <Col lg={1} md={1} sm={1} xs={1} className={styles.avatar_container}>
                        <Avatar
                            src={user.user.picture ?
                                `${user.user.picture}`
                                :
                                config.default_picture}
                            className={styles.profile_image} />
                    </Col>
                    <Col lg={11} md={11} sm={11} xs={11} className={styles.header_container}>
                        <span className={styles.highlight}>{user.user.name} {user.user.last_name}</span> escribe tu respuesta para
                        <span className={styles.highlight}>{` ${father.name} ${father.last_name}`}</span>
                        <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <NewPost padre={parent_post} handleSubmitPost={handleSubmitPost} handleModal={handleModal}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default AnswerInput;