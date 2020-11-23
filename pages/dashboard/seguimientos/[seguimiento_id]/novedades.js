import { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import BackgroundLoader from "../../../../src/components/commons/background_loader/background_loader";
import ShowMore from "../../../../src/components/commons/show_more/show_more";
import TitlePage from "../../../../src/components/commons/title_page/title_page";
import DateFilter from "../../../../src/components/tracking/view/date_filter/date_filter";
import NewPost from "../../../../src/components/tracking/view/new_post/new_post";
import Post from "../../../../src/components/tracking/view/post/post";
import config from "../../../../src/utils/config";
import { parsePostData } from "../../../../src/utils/general_services/services";
import { addNovedadesFileService, addNovedadesService, getMoreNovedadesService, getNovedadesService } from "../../../../src/utils/novedades/services/novedades_services";
import styles from './styles.module.scss';

const Novedades = ({ trackingId }) => {

    const url = `${config.api_url}/actualizaciones/${trackingId}/list/`;
    const currentTracking = useSelector((store) => store.currentTracking);
    const user = useSelector((store) => store.user);
    const [news, setNews] = useState([]);
    const divRef = useRef(null);
    const [divHeight, setDivHeight] = useState();
    const [showMore, setShowMore] = useState();
    const [nextUrl, setNextUrl] = useState();
    const [date, setDate] = useState();

    useSWR(url, () => {
        getNovedadesService(user.user.token, trackingId).then((result) => {
            if (result.success) {
                setNews(result.result.results);
                setNextUrl(result.result.next);
            }
        })
    });

    useEffect(() => {
        setDivHeight(divRef.current.clientHeight + 100)
    }, [divRef])

    useEffect(() => {
        if (currentTracking) {
            const fechasSeguimiento = {
                fecha_desde: currentTracking.fecha_inicio,
                fecha_hasta: currentTracking.fecha_cierre
            }
            setDate(fechasSeguimiento);
        }
    }, [])

    const handleShowMore = () => {
        getMoreNovedadesService(user.user.token, nextUrl).then((result) => {
            const newPosts = result.result.results;
            const newData = [...news].concat(newPosts);
            setNews(newData);
            setNextUrl(result.result.next);
            setDivHeight(prevState => prevState + 1500);
            setShowMore(false);
        })
    }
    const handleScroll = (e) => {
        const currentPosition = e.target.scrollTop;
        setShowMore(currentPosition > divHeight);
    }

    async function handleSubmitPost({ cuerpo, files, padre }) {
        const token = user.user.token;
        let postData = {
            cuerpo: cuerpo,
            seguimiento: trackingId,
        }
        if (padre) postData.seguimiento_padre = padre
        return addNovedadesService(postData, token).then((result) => {
            if (result.success) {
                if (files && !!files.length) {
                    const DATA = {
                        post: result.result.id,
                        files: files
                    }
                    return addNovedadesFileService(DATA, token).then((result) => {
                        mutate(url);
                        return result;
                    });
                } else {
                    mutate(url);
                    return result;
                }
            }
        })
    }


    async function handleFilterNewsByDates(from, to) {
        const FILTER_DATE = {
            from: from,
            to: to
        }
        return getNovedadesService(user.user.token, trackingId, FILTER_DATE).then((result) => {
            if (result.success) {
                setNews(result.result.results);
                setNextUrl(result.result.next);
            }
            return result;
        })
    }


    return (

        <Row lg={12} md={12} sm={12} xs={12} onScroll={handleScroll} ref={divRef} className={styles.container}>
            {showMore
                && nextUrl
                && <ShowMore
                    show={showMore}
                    showMore={handleShowMore}
                />}
            <Col lg={12} md={12} sm={12} xs={12} >
                <Row lg={12} md={12} sm={12} xs={12} >
                    <Col lg={11} md={11} sm={11} xs={11}>
                        <TitlePage title={"Novedades del Seguimiento"} fontSize={16} />
                    </Col>
                    {date && <DateFilter handleSend={handleFilterNewsByDates} date={date} novedades={true} />}
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} id={styles.new_post_container}>
                        <NewPost handleSubmitPost={handleSubmitPost} />
                    </Col>
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container} >

                    {
                        news && !!news.length ?
                            news.map((post, i) => {
                                return (
                                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container} key={i}>
                                        <Post postData={parsePostData(post, currentTracking)} handleSubmitPost={handleSubmitPost} />
                                    </Col>

                                )
                            })
                            :
                            <div className={styles.empty_data}>
                                <span>¡Comenzá a publicar las novedades del seguimiento!</span>
                            </div>

                    }
                </Row>

            </Col>
        </Row>
    )
}


export default Novedades;