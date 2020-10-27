import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FilesSelected from "./file_selected";
import FileUploader from "./file_uploader";
import styles from './styles.module.scss';
import Alert from "react-s-alert";

const FileInput = ({ handleChange, files, deleteFile }) => {
    const [state, setState] = useState({});
    const input = {
        type: "file",
        name: "media",
        fileType: "*",
        fileAcceptMultiple: true,
    }

    useEffect(() => {
        if (!!files?.length) {
            setState({ ...state, media: files })
        }
    }, [files])

    const fileAccept = (name, multiple, files) => {
        if (multiple) {
            const newFiles = state['media'] ? [...state['media']] : [];
            let flag = false;
            Array.from(files).forEach((el, i) => {
                if (i < 3 && newFiles.length < 3) {
                    newFiles.push(el);
                } else {
                    flag = true;
                }
            });
            if (flag) {
                Alert.error("Se permite subir hasta tres archivos, el resto fueron ignoradas", {
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

    useEffect(() => {
        handleChange(state?.media)
    }, [state]);

    const handleDeleteFile = (file) => {
        if (file.id) {
            deleteFile(file.id).then((result) => {
                if (result.success) {
                    const newFiles = [...state['media']].filter((selectedFile) => { return selectedFile.id !== file.id })
                    setState({ ...state, media: newFiles });
                }
            });
        } else {
            const newFiles = [...state['media']].filter((selectedFile) => { return selectedFile.name !== file.name })
            setState({ ...state, media: newFiles });
        }
    }
    return (
        <>
            <Row lg={12} md={12} sm={12} xs={12} style={{ width: '100%' }}>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.input_file_container}>
                    <FileUploader
                        onFilesAdded={fileAccept}
                        input={input} />
                </Col>
                {
                    files && !!files.length &&
                    <Col lg={12} md={12} sm={12} xs={12} className={styles.selected_files_container}>
                        <FilesSelected state={state} input={input} deleteFile={handleDeleteFile} />
                    </Col>
                }
            </Row>


        </>
    )
}

export default FileInput;