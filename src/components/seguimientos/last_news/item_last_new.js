import { Avatar } from '@material-ui/core';
import { Col, Row } from 'react-bootstrap';
import config from '../../../utils/config';
import styles from './styles.module.scss';
import Link from "next/link";

const ItemContainer = ({ newData }) => {
    const owner = newData?.usuario;
    return (
        <Link href={`seguimientos/${newData.seguimiento.id}`}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.item_container}>
                <Col lg={1} md={1} sm={1} xs={1}>
                    <Avatar
                        src={owner?.picture ?
                            `${owner?.picture}`
                            :
                            config.default_picture}
                    />
                </Col>
                <Col lg={10} md={10} sm={10} xs={10} className={styles.header_container}>
                    <span className={styles.highlight}>{owner?.name} {owner?.last_name}</span> comentó en{" "}
                    <span className={styles.highlight}> {newData.seguimiento.nombre} : </span>
                    <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <span className={styles.comment_body}>{newData.cuerpo}</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Link>
    )
}

export default ItemContainer;