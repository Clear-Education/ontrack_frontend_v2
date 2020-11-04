import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TitlePage from '../../../../src/components/commons/title_page/title_page';
import BackgroundLoader from '../../../../src/components/commons/background_loader/background_loader'
import { getAsistenciasService } from "../../../../src/utils/asistencias/services/asistencias_services";
import { useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { convertDateToSendOnQuery } from "../../../../src/utils/commons/common_services";
import { getOneStudentCourseService } from "../../../../src/utils/student/service/student_service";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';


const localizer = momentLocalizer(moment);

const StudentCalendar = () => {
    const startDate = convertDateToSendOnQuery(new Date(new Date().getFullYear(), 0, 1));
    const [loading, setLoading] = useState();
    const [studentId, setStudentId] = useState();
    const user = useSelector((store) => store.user);
    const router = useRouter();
    const [studentData, setStudentData] = useState();

    useEffect(() => {
        let params = Object.values(router.query);
        let id = params[0];
        setStudentId(id);
    }, [router.query]);

    useEffect(() => {
        if (studentId) {
            setLoading(true);
            getOneStudentCourseService(user.user.token, studentId).then((result) => {
                if (result.success) {
                    setStudentData(result.result.alumno);
                    getAsistenciasService(user.user.token, null, studentId, startDate).then((result) => {
                        setLoading(false);
                    })
                } else {
                    setLoading(false);
                }
            })

        }


    }, [studentId])

    return (
        loading ? <BackgroundLoader show={loading} /> :
            <Row lg={12} md={12} sm={12} xs={12}>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <TitlePage title={`Asistencias de ${studentData?.nombre} ${studentData?.apellido}`} />
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <div style={{ height: '500pt' }}>
                        <Calendar
                            events={[]}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={moment().toDate()}
                            localizer={localizer}
                            selectable
                            onSelectSlot = {(info)=>{console.log(info)}}
                            views={['month']}
                        />
                    </div>
                </Col>
            </Row>
    )
}


export default StudentCalendar;
