import TitlePage from "../../../../src/components/commons/title_page/title_page";
import { useRouter } from "next/dist/client/router";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getTrackingService } from "../../../../src/utils/tracking/services/tracking_services";
import { getTrackingGoalsService } from "../../../../src/utils/goals/services/goals_services";
import SubMenu from "../../../../src/components/commons/sub_menu/sub_menu";
import * as types from "../../../../redux/types";
import BackgroundLoader from "../../../../src/components/commons/background_loader/background_loader";
import RightSideBar from "./rigth_side_bar";
import Novedades from "./novedades";
import { parseGoalsData } from "../../../../src/utils/general_services/services";

const Seguimiento = () => {
    const router = useRouter();
    const user = useSelector((store) => store.user);
    const currentTracking = useSelector((store) => store.currentTracking);
    const [trackingId, setTrackingId] = useState();
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState();
    const dispatch = useDispatch();


    useEffect(() => {
        let params = Object.values(router.query);
        let id = params[0];
        setTrackingId(id);
    }, [router.query]);

    useEffect(() => {
        if (trackingId) {
            getTrackingService(user.user.token, trackingId)
                .then((result) => {
                    const TRACKING_DATA = result.result;
                    dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: TRACKING_DATA });
                })
        }
    }, [trackingId]);

    useEffect(() => {
        if (currentTracking.id && !flag) {
            getTrackingGoalsService(user.user.token, currentTracking.id).then((result) => {
                const GOALS = parseGoalsData(result.result);
                const GOALS_PAYLOAD = {
                    ...currentTracking,
                    ...GOALS
                }
                dispatch({ type: types.SAVE_CURRENT_TRACKING_DATA, payload: GOALS_PAYLOAD });
                setLoading(false);
                setFlag(true);
            })
        }
    }, [currentTracking])

    useEffect(() => {
        return () => {
            dispatch({ type: types.RESET_CURRENT_TRACKING_DATA });
        }
    }, []);

    return (
        loading ? <BackgroundLoader show={loading} /> :
            <Row lg={12} md={12} sm={12} xs={12} style={{ margin: 'auto' }}>
                <div className={styles.sub_menu_container}>
                    <SubMenu />
                </div>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.header_container}>
                    <TitlePage title={currentTracking.nombre} />
                    <Col lg={12} md={12} sm={12} xs={12} className="left" style={{ paddingLeft: '20px' }}>
                        <span>{currentTracking.descripcion}</span>
                    </Col>
                </Row>
                {/* LADO IZQ */}
                <Col lg={7} md={7} sm={7} xs={7}>
                    <Novedades trackingId={trackingId} />
                </Col>
                {/* LADO DER */}
                <Col lg={4} md={4} sm={4} xs={4} className={styles.container}>
                    <RightSideBar currentTracking={currentTracking} />
                </Col>
            </Row>


    )

}

export default Seguimiento;