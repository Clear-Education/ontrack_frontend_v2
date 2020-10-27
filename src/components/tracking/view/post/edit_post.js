import { Row, Col } from "react-bootstrap";
import SendIcon from '@material-ui/icons/Send';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import FileInput from "../../../commons/file_uploader";
import { FormHelperText, IconButton } from "@material-ui/core";
import { addNovedadesFileService, deleteNovedadesFileService } from "../../../../utils/novedades/services/novedades_services";
import { useSelector } from "react-redux";
import { mutate } from "swr";
import config from "../../../../utils/config";

const INITIAL_STATE = {
    cuerpo: "",
    files: [],
}


const EditPostForm = (props) => {
    const url = `${config.api_url}/actualizaciones/${props.postData.seguimiento.id}/list/`;
    const [state, setState] = useState(INITIAL_STATE);
    const user = useSelector((store) => store.user);
    const [validationLength, setValidationLength] = useState(false);


    useEffect(() => {
        if (props.postData) {
            setState({ ...state, cuerpo: props.postData.cuerpo, files: props.postData.adjuntos })
        }
    }, [])

    const handleValidationLength = (value) => {
        if (value.length < 500) {
            setValidationLength(false);
        } else {
            setValidationLength(true);
        }
    }

    const handleChange = (prop) => (e) => {
        const VALUE = e.target.value;
        handleValidationLength(VALUE);
        setState({ ...state, [prop]: VALUE });
    }

    const handleFileChange = (files) => {
        setState({ ...state, files: files })
    }

    const checkFilesToSend = () => {
        let filesToSend = [];
        state.files.map((file) => {
            if (!file.id) {
                filesToSend.push(file);
            }
        })
        return filesToSend;
    }

    async function handleDeleteFile(fileId) {
        return deleteNovedadesFileService(fileId, user.user.token).then((result) => {
            return result
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validationLength) {
            return
        }
        const filesToSend = checkFilesToSend();
        props.handleSubmitPost(state).then((result) => {
            if (result.success) {
                setState(INITIAL_STATE);
                if (!!filesToSend.length) {
                    const DATA = {
                        post: props.postData.id,
                        files: filesToSend
                    }
                    addNovedadesFileService(DATA, user.user.token).then(() => {
                        mutate(url);
                    });
                }
            }
            mutate(url);
            props.handleClose && props.handleClose(false);
        });
    }
    return (
        <div className={styles.edit_container}>
            <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <form onSubmit={handleSubmit}>
                        <FormControl variant="outlined">
                            <TextField
                                multiline
                                value={state.cuerpo}
                                label={"Publica alguna novedad"}
                                InputLabelProps={{ style: { color: 'var(--black) !important' } }}
                                rowsMax={3}
                                onChange={handleChange('cuerpo')}
                                required
                            />
                        </FormControl>
                        {validationLength && (
                            <FormHelperText
                                className="helper-text"
                                style={{ color: "rgb(182, 60, 47)" }}
                            >
                                La actualización debe contener menos de 500 caracteres
                            </FormHelperText>
                        )}
                        <div className={styles.send_container}>
                            <IconButton type="submit">
                                <SendIcon />
                            </IconButton>
                        </div>
                    </form>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12} className={styles.bottom_container}>
                    <FileInput handleChange={handleFileChange} files={state.files} deleteFile={handleDeleteFile} />
                </Col>
            </Row>
        </div>
    )
}

export default EditPostForm;