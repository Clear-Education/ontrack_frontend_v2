import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TitlePage from '../../../../src/components/commons/title_page/title_page';
import BackgroundLoader from '../../../../src/components/commons/background_loader/background_loader'
import { getAsistenciasService } from "../../../../src/utils/asistencias/services/asistencias_services";
import { useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { convertDateToSendOnQuery, parseCalendarDates } from "../../../../src/utils/commons/common_services";
import { getOneStudentCourseService } from "../../../../src/utils/student/service/student_service";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import BackLink from '../../../../src/components/commons/back_link/back_link';
import styles from './styles.module.scss';

require('moment/locale/es.js');
import moment from 'moment';

const localizer = momentLocalizer(moment);

const StudentCalendar = () => {
    const [loading, setLoading] = useState();
    const [studentId, setStudentId] = useState();
    const [studentData, setStudentData] = useState();
    const [events, setEvents] = useState([]);
    const user = useSelector((store) => store.user);
    const router = useRouter();

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
                    const from = convertDateToSendOnQuery(new Date(new Date().getFullYear(), 0, 1));
                    const to = convertDateToSendOnQuery(new Date());
                    const dates = {
                        from: from,
                        to: to
                    }
                    getAsistenciasService(user.user.token, null, studentId, dates).then((result) => {
                        setLoading(false);
                        if (result.success) {
                            let events = [];
                            result.result.results.map((event) => {
                                const date = parseCalendarDates(event.fecha);
                                const EVENT_DATA = {
                                    id: event.id,
                                    title: event.asistio ? 'PRESENTE' : 'AUSENTE',
                                    allDay: true,
                                    start: date,
                                    end: date
                                }
                                events.push(EVENT_DATA);
                            })
                            setEvents(events);
                        }
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
                <div className={styles.sub_menu_container}>
                    <BackLink url={'/dashboard/asistencias'}/>
                </div>

                <Col lg={12} md={12} sm={12} xs={12}>
                    <TitlePage title={`Asistencias de ${studentData?.nombre} ${studentData?.apellido}`} />
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <div style={{ height: '500pt', width: '90%', marginTop: '20px' }}>
                        <Calendar
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={moment().toDate()}
                            localizer={localizer}
                            selectable
                            views={['month']}
                            messages={{
                                next: "Sig",
                                previous: "Ant",
                                today: "Hoy",
                            }}
                            eventPropGetter={
                                (event, start, end, isSelected) => {
                                  let newStyle = {
                                      padding: '20px'
                                  };
                                  if (event.title === 'AUSENTE'){
                                    newStyle.backgroundColor = "var(--red)"
                                  }else{
                                    newStyle.backgroundColor = "var(--green)"
                                  }
                                  return {
                                    className: "",
                                    style: newStyle
                                  };
                                }
                              }
                        />
                    </div>
                </Col>
            </Row>
    )
}


export default StudentCalendar;
