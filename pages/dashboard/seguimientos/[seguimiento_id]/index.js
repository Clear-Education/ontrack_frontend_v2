import TitlePage from "../../../../src/components/commons/title_page/title_page";
import { useRouter } from "next/dist/client/router";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import DateFilter from "../../../../src/components/tracking/view/date_filter/date_filter";
import NewPost from "../../../../src/components/tracking/view/new_post/new_post";
import Post from "../../../../src/components/tracking/view/post/post";
import { useDispatch, useSelector } from "react-redux";
import { getTrackingService } from "../../../../src/utils/tracking/services/tracking_services";
import { getStudentGoalsService, getTrackingGoalsService } from "../../../../src/utils/goals/services/goals_services";
import GoalsViewer from "../../../../src/components/tracking/view/goals_viewer/goals_viewer";
import StudentViewer from "../../../../src/components/tracking/view/student_viewer/student_viewer";
import SubMenu from "../../../../src/components/commons/sub_menu/sub_menu";
import * as types from "../../../../redux/types";
import { parseGoalsData } from "./services/services";
import BackgroundLoader from "../../../../src/components/commons/background_loader/background_loader";

const Seguimiento = () => {
    const router = useRouter();
    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store)=>store.currentTracking);
    const [trackingId, setTrackingId] = useState();
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();

    useEffect(() => {
        let params = Object.values(router.query);
        let id = params[0];
        setTrackingId(id);
    }, [router.query]);

    useEffect(() => {
        if (trackingId) {
            getTrackingService(user.user.token, trackingId).then((result) => {
                const TRACKING_DATA = result.result;
                dispatch({type:types.SAVE_CURRENT_TRACKING_DATA, payload: TRACKING_DATA});
                setLoading(false);
            })
        }
    }, [trackingId]);

    useEffect(()=>{
        return () =>{
            dispatch({type:types.RESET_CURRENT_TRACKING_DATA});
        }
    },[])


    return (
        loading ? <BackgroundLoader show={loading}/> : 
        <Row lg={12} md={12} sm={12} xs={12} style={{ margin: 'auto' }}>
            <div className={styles.sub_menu_container}>
                <SubMenu />
            </div> 
            <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                        <>
                            <TitlePage title={currentTracking.nombre} />
                            <Col lg={12} md={12} sm={12} xs={12} className="left" style={{ paddingLeft: '20px' }}>
                                <span>{currentTracking.descripcion}</span>
                            </Col>
                        </>
            </Row>
            {/* LADO IZQ */}
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

            {/* LADO DER */}
            <Col lg={3} md={3} sm={3} xs={3} className={styles.container}>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                        <span className={styles.section_title}>Alumnos</span>
                        <StudentViewer students={currentTracking.alumnos} />
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.student_item_container}>
                        <span className={styles.section_title}>Plazos</span>
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <span className={styles.section_title}>Objetivos</span>
                        <GoalsViewer />
                    </Col>
                </Row>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                        <span className={styles.section_title}>Métricas</span>
                    </Col>
                </Row>
            </Col>
        </Row>


    )

}

export default Seguimiento;