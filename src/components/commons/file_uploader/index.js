import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FilesSelected from "./file_selected";
import FileUploader from "./file_uploader";
import styles from './styles.module.scss';
import Alert from "react-s-alert";

const FileInput = ({handleChange}) => {

    const [state, setState] = useState({});
    const input = {
        type: "file",
        name: "media",
        fileType: "image/*",
        fileAcceptMultiple: true, 
    }

    const fileAccept = (name, multiple, files) => {
        if (multiple) {
            const newFiles = [];
            let flag = false;
            Array.from(files).forEach((el,i) => {
                if(i<3){
                    newFiles.push(el);
                }else{
                   flag = true;
                }
            });
            if(flag){
                Alert.error("Se permite subir hasta tres fotos, el resto fueron ignoradas", {
                    effect: "stackslide",
                });
            }
            setState({ ...state, [name]: newFiles });
        } else {
            let previewEl = document.getElementById(`${name}_img_preview`);
            previewEl.src = window.URL.createObjectURL(files[0]);
            setState({ ...state, [name]: files[0] });
        }
    };

    useEffect(()=>{
        handleChange(state.media)
    },[state]);

    return (
        <>
            <Row lg={12} md={12} sm={12} xs={12} style={{ width: '100%' }}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.input_file_container}>
                    <FileUploader
                        onFilesAdded={fileAccept}
                        input={input} />
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.selected_files_container}>
                    <FilesSelected state={state} input={input} />
                </Col>
            </Row>


        </>
    )
}

export default FileInput;