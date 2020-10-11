import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import TitlePage from "../../../../src/components/commons/title_page/title_page";
import NewPost from "../../../../src/components/tracking/view/new_post/new_post";
import Post from "../../../../src/components/tracking/view/post/post";
import config from "../../../../src/utils/config";
import { addNovedadesFileService, addNovedadesService, getNovedadesService } from "../../../../src/utils/novedades/services/novedades_services";
import styles from './styles.module.scss';


const Novedades = ({trackingId}) =>{

    const url = `${config.api_url}/actualizaciones/${trackingId}/list/`;
    const user = useSelector((store) => store.user);
    const[newsData, setNewsData] = useState();

    useEffect(()=>{
        getNovedadesService(user.user.token,trackingId).then((result)=>{
           setNewsData(result.result.results);
        })
    },[]);


    useSWR(url, () => {
        getNovedadesService(user.user.token,trackingId).then((result)=>{
            setNewsData(result.result.results);
         })
    }); 

    const handleSubmitPost = ({cuerpo,files}) =>{
        const token = user.user.token;
        const DATA = {
            cuerpo:cuerpo
        }
        addNovedadesService(DATA, token).then((result)=>{
            if(result.success){
                addNovedadesFileService(files,token).then((result)=>{
                    mutate(url);
                });
            }
        })
    }
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
                        <NewPost handleSubmitPost = {handleSubmitPost}/>
                    </Col>
                </Row>

                <Row lg={12} md={12} sm={12} xs={12} className={styles.new_post_container}>
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.item_container}> 
                        {
                            newsData && !!newsData.lenght ? 
                            newsData.map((post)=>{
                                return(
                                    <Post />
                                )
                            })
                            :
                            <span>¡Comenzá a publicar las novedades del seguimiento!</span>
                        }
                    </Col>
                </Row>

            </Col>
        </Row>
    </Col>
    )
}


export default Novedades;