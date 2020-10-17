// Import dependencies
import { Row, Col, Collapse } from "react-bootstrap";
import CancelIcon from '@material-ui/icons/Cancel';
// Import components
import styles from "./styles.module.scss";

/**
 * Change styles in ./styles.module.scss file
 */


const FilesSelected = ({ state, input, deleteFile }) => {

    const handleDeleteFile = (file) =>{
        deleteFile(file);
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12}>
            <Col
                className="left"
                lg={12}
                md={12}
                sm={12}
                xs={12}
                styles={{ padding: 0 }}
            >
                <div className={styles.files_container}>
                    <Collapse in={!!state[input.name]?.length}>
                        {state[input.name] && state[input.name].length > 0 ? (
                            <>
                                {state[input.name].map((file, i) => (
                                    <div className={styles.preview_photo} key={i}>
                                        <div className={styles.photo_container}>
                                            <div className={styles.file_detail}>
                                                {
                                                    <div className={styles.delete_container} onClick={()=>handleDeleteFile(file)}>
                                                        <CancelIcon style={{ color: 'var(--red)' }} />
                                                    </div>
                                                }
                                                <strong>{file.name || file.upload_name}</strong>
                                                {file.size && <p><strong>{Math.round(file.size / (1024 * 1024))} MB</strong></p>}
                                                {file.file_size && <p><strong>{Math.round(file.file_size / (1024))} MB</strong></p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                                <div className={styles.preview_photo}>
                                    <div className={styles.photo_container}>
                                        <img
                                            src="#"
                                            id={`${input.name}_img_preview`}
                                            alt="img-preview"
                                            className={styles.selected_img}
                                        />
                                        {state[input.name] && (
                                            <div className={styles.file_detail}>
                                                <p>{state[input.name].name}</p>
                                                <p>
                                                    {Math.round(state[input.name].size / (1024 * 1024))}
                                                    <strong> MB</strong>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                    </Collapse>
                </div>
            </Col>
        </Row>
    );
};

export default FilesSelected;
