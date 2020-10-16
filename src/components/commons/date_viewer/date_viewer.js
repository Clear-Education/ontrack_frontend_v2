const { Row, Col } = require("react-bootstrap")
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import styles from './styles.module.scss';

const DateViewer = ({ start, end }) => {
    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container_plazos}>
            <Col lg={5} md={5} sm={5} xs={5}>
                <span className={styles.viewer_date}>{start}</span>
            </Col>

            <Col lg={2} md={2} sm={2} xs={2}><ArrowForwardIcon style={{ color: 'var(--orange)' }} /></Col>
            <Col lg={5} md={5} sm={5} xs={5}>
                <span className={styles.viewer_date}>{end}</span>
            </Col>
        </Row>
    )
}

export default DateViewer;