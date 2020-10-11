import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import TitlePage from "../../../../src/components/commons/title_page/title_page";
import NewPost from "../../../../src/components/tracking/view/new_post/new_post";
import Post from "../../../../src/components/tracking/view/post/post";
import { getNovedadesService } from "../../../../src/utils/novedades/services/novedades_services";
import styles from './styles.module.scss';

const Novedades = ({trackingId}) =>{

/*     useEffect(()=>{
        getNovedadesService()
    },[]) */
    return(
        <Col lg={8} md={8} sm={8} xs={8} >
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
            <Col lg={12} md={12} sm={12} xs={12}>
                <Row lg={12} md={12} sm={12} xs={12}>
                    <Col lg={6} md={6} sm={6} xs={6}>
                        <TitlePage title={"Novedades del Seguimiento"} fontSize={16} />
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={6}>
            
                    </Col>

                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <NewPost />
                    </Col>
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <Post />
                    </Col>
                </Row>

            </Col>
        </Row>
    </Col>
    )
}


export default Novedades;