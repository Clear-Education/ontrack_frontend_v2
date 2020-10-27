import { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import config from '../../../utils/config';
import { getLastNovedadesService, getMoreLastNovedadesService } from '../../../utils/novedades/services/novedades_services';
import TitlePage from '../../commons/title_page/title_page';
import ItemContainer from './item_last_new';
import styles from './styles.module.scss';

const LastNews = () => {

    const lastNewsUrl = `${config.api_url}/actualizaciones/list_last/`
    const [newsData, setNewsData] = useState([]);
    const [showMore, setShowMore] = useState();
    const user = useSelector((store) => store.user);
    const [nextUrl, setNextUrl] = useState();

    useSWR(lastNewsUrl, () => {
        getLastNovedadesService(user.user.token).then((result) => {
            if (result.success) {
                let news = [...result.result.results];
                setNewsData(news);
                setNextUrl(result.result.next);
            }
        })
    });


    const handleShowMore = () => {
        getMoreLastNovedadesService(user.user.token, nextUrl).then((result) => {
            const newPosts = result.result.results;
            const newData = [...newsData].concat(newPosts);
            setNewsData(newData);
            setNextUrl(result.result.next);
            setShowMore(false);
        })
    }



    return (
        <Row lg={12} md={12} sm={12} xs={12} className="mw-100">
            <Col lg={12} md={12} sm={12} xs={12} className={styles.title_container}>
                <TitlePage title={"Últimas novedades"} fontSize={15} />
            </Col>
            <Col
                lg={12} md={12} sm={12} xs={12}
                className={!newsData.length ? styles.empty_content_container : styles.content_container}
            >
                {
                    !newsData.length ?
                        <span>No hay actualizaciones nuevas</span>
                        :
                        newsData.map((newData, i) => {
                            return (
                                <ItemContainer newData={newData} key={i} />
                            );
                        })}
                {
                    nextUrl
                    &&
                    <div className={styles.show_more_container} onClick={handleShowMore}>
                        <span>Mostrar más</span>
                    </div>
                }
            </Col>
        </Row>
    )
}

export default LastNews;