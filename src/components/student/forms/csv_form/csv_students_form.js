import { Col, Row } from "react-bootstrap";
import styles from './styles.module.scss';
import Form from '../../../commons/form/form';
import Alert from "react-s-alert";
import { useSelector } from "react-redux";
import { parseStudentsCsvToJson } from "../../../../utils/commons/common_services";
import { addNotasMultipleService } from "../../../../utils/notas/services/notas_services";
import ExportToXlsx from "../../../commons/export_to_xlsx/export_to_xlsx";
import { addStudentService } from "../../../../utils/student/service/student_service";

const CSVStudentsForm = ({ handleClose, refreshData }) => {
    const user = useSelector((store) => store.user);
    const templateHeaders = [
        {
            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            legajo: '',
            fecha_de_nacimiento: '(dd/mm/yyyy)',
            direccion: '',
            fecha_de_inscripcion: '(dd/mm/yyyy)',
            pais: '',
            provincia: '',
        }
    ];

    async function handleDataToSubmit(submitData) {
        if (!!Object.keys(submitData).length) {
            parseStudentsCsvToJson(submitData.media, handleSubmit);
        } else {
            Alert.error("Debe subir un archivo CSV y proporcionar una fecha válida para continuar", {
                effect: "stackslide",
            });
        }
    }
    const validateData = (students) =>{
        let validData = true;
        students.map((student)=>{
            Object.keys(student).map((key)=>{
                if(!student[key] || student[key] === ""){
                    validData = false;
                    Alert.error(`${key} Es un campo obligatorio`, {
                        effect: "stackslide",
                    });
                }
            })
        });
        return validData;
    }


    const handleSubmit = (dataToSend) => {
        let students = [];
        dataToSend.map((alumno) => {
            let alumnoData = {
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                dni: alumno.dni,
                email: alumno.email,
                legajo: alumno.legajo,
                fecha_de_nacimiento: alumno.fecha_de_nacimiento === '(dd/mm/yyyy)' ? '' : alumno.fecha_de_nacimiento,
                direccion: alumno.direccion,
                fecha_de_inscripcion: alumno.fecha_de_inscripcion === '(dd/mm/yyyy)' ? '' : alumno.fecha_de_inscripcion,
                pais: alumno.pais,
                provincia: alumno.provincia,
            }
            students.push(alumnoData);
        });
        const validData = validateData(students);
        if(validData){
            addStudentService(user.user.token, students).then((result) => {
                if (result.success) {
                    handleClose();
                    refreshData();
                }
            })
        }
    }

    return (
        <div className={styles.csv_container}>
            <div className={styles.message_alert}>
                Se recomienda siempre el uso de la plantilla propuesta.
            </div>
            <Row lg={12} md={12} sm={12} xs={12}>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <ExportToXlsx fileData={templateHeaders} template_name="plantilla_alumnos_ontrack" />
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.form_container}>
                    <Form
                        handleSubmit={handleDataToSubmit}
                        button={<button className="ontrack_btn csv_btn" style={{ width: '100%' }}>Enviar</button>}
                        inputs={[
                            {
                                type: "file",
                                name: "media",
                                fileAreaDisabled: false,
                                fileAreaIcon: <img src="/icons/carpeta.svg" style={{ width: 70 }} />,
                                fileAreaTitle: { text: "Cargar archivo", size: 18 },
                                fileAreaDescription: {
                                    text: "Solo se permiten documentos con extensión .csv o .xlsx",
                                    size: 14,
                                },
                                fileType: ".csv,.xlsx",
                                fileAcceptMultiple: false,
                            },
                        ]}
                    />
                </Col>
            </Row>
        </div >
    )
}

export default CSVStudentsForm;