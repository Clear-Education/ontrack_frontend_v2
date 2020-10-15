import TitlePage from "../../../src/components/commons/title_page/title_page";
import styles from './styles.module.scss'
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useSWR from "swr";
import config from "../../../src/utils/config";
import BackgroundLoader from "../../../src/components/commons/background_loader/background_loader";
import { IconButton } from "@material-ui/core";
import Link from "next/link";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { motion } from "framer-motion";
import { Row, Col } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import MTConfig from "../../../src/utils/table_options/MT_config";
import { getAllTrackingService } from "../../../src/utils/tracking/services/tracking_services";
import { useRouter } from "next/dist/client/router";
import * as types from "./../../../redux/types";
import LastNews from "../../../src/components/seguimientos/last_news/last_news";


const Seguimientos = () => {

    const url = `${config.api_url}/seguimientos/list/`;
    const [trackingData, setTrackingData] = useState([])
    const user = useSelector((store) => store.user);
    const [isLoading, setIsLoading] = useState(false);
    const [showTable, setShowTable] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: types.RESET_CURRENT_TRACKING_DATA });
    }, [])

    useEffect(() => {
        setShowTable(true);
    }, [])

    useSWR(url, () => {
        setIsLoading(true);
        getAllTrackingService(user.user.token).then((result) => {
            setIsLoading(false)
            let trackings = [...result.result.results];
            let parsedTrackings = [];
            trackings.map((tracking) => {
                let newTrackingData = {
                    id: tracking.id,
                    nombre: tracking.nombre,
                    descripcion: tracking.descripcion,
                    fecha_inicio: tracking.fecha_inicio,
                    fecha_cierre: tracking.fecha_cierre,
                    estado: tracking.en_progreso ? 'En progreso' : 'Finalizado'
                }
                parsedTrackings.push(newTrackingData);
            })
            setTrackingData(parsedTrackings);
        })
    }
    );




    return (
        <>
            {isLoading && <BackgroundLoader show={isLoading} />}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Row lg={12} md={12} sm={12} xs={12}>
                    <Col lg={9} md={9} sm={9} xs={9} style={{ marginLeft: '-4%' }}>
                        <Row lg={12} md={12} sm={12} xs={12} style={{ alignItems: 'center' }}>
                            <Col lg={6} md={6} sm={6} xs={6}>
                                <TitlePage title="Seguimientos" />
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} className={styles.add_btn_container}>
                                {user.user.groups === "Pedagogía" &&
                                    <Link href="seguimientos/nuevo"
                                        onClick={() => dispatch({ type: types.RESET_TRACKING_SOLICITUD_DATA })}>
                                        <button className="ontrack_btn add_btn">Nuevo Seguimiento </button>
                                    </Link>
                                }
                            </Col>

                        </Row>

                        <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            style={{ marginTop: 20 }}
                        >
                            {showTable &&
                                <MUIDataTable
                                    data={trackingData}
                                    options={MTConfig("Seguimientos").options}
                                    components={MTConfig().components}
                                    localization={MTConfig().localization}
                                    columns={[

                                        {
                                            name: "id",
                                            label: "Id",
                                            options: {
                                                display: false,
                                                filter: false
                                            },

                                        },
                                        {
                                            name: "nombre",
                                            label: "Nombre",
                                        },
                                        {
                                            name: "descripcion",
                                            label: "Descripción",
                                        },
                                        {
                                            name: "fecha_inicio",
                                            label: "Inicio",
                                        },
                                        {
                                            name: "fecha_cierre",
                                            label: "Fin",
                                        },
                                        {
                                            name: "estado",
                                            label: "Estado",
                                        },
                                        {
                                            name: "actions",
                                            label: "Acciones",
                                            options: {
                                                customBodyRender: (value, tableMeta, updateValue) => {

                                                    return (
                                                        <>
                                                            <Link href={`seguimientos/${tableMeta.rowData[0]}`}>
                                                                <IconButton>
                                                                    <ArrowForwardIosIcon />
                                                                </IconButton>
                                                            </Link>
                                                        </>
                                                    )
                                                },
                                                filter: false
                                            },
                                        }
                                    ]}
                                />
                            }
                        </Col>
                    </Col>
                    <Col lg={3} md={3} sm={3} xs={3} className={styles.last_news_container}>
                        <LastNews />
                    </Col>
                </Row>

            </motion.div>
        </>
    )

}


export default Seguimientos;



