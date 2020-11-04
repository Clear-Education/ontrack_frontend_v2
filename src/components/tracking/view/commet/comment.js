import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import { Avatar, IconButton } from "@material-ui/core";
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useState } from "react";
import config from "../../../../utils/config";
import { deleteNovedadesService, editNovedadesService } from "../../../../utils/novedades/services/novedades_services";
import Modal from '../../../commons/modals/modal';
import DeleteForm from "../../../commons/delete_form/deleteForm";
import { useSelector } from "react-redux";
import { mutate } from "swr";
import EditPostForm from "../post/edit_post";

export const Comment = ({ commentData }) => {
    const owner = commentData.usuario.usuario;
    const user = useSelector((store) => store.user);
    const tracking = commentData.seguimiento;
    const [openMoreOptions, setOpenMoreOptions] = useState(false);
    const [fileViewer, setFileViewer] = useState();
    const url = `${config.api_url}/actualizaciones/${tracking.id}/list/`;

    const handleOpen = () => {
        setOpenMoreOptions(!openMoreOptions);
    }
    async function handleDeletePost(e, data) {
        e.preventDefault();
        let novedad_id = data.id;
        return deleteNovedadesService(user.user.token, novedad_id).then((result) => {
            mutate(url);
            return result
        })
    }
    async function handleEditPost(data) {
        const DATA = {
            id: commentData.id,
            cuerpo: data.cuerpo,
            files: data.files
        }
        return editNovedadesService(DATA, user.user.token).then((result) => {
            mutate(url);
            return result
        })
    }
    const handleOpenFile = (url) => {
        window.open(url, '_blank');
    }

    return (

        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
            <Col lg={1} md={1} sm={1} xs={1}>
                <Avatar
                    src={owner?.picture ?
                        `${owner?.picture}`
                        :
                        config.default_picture}
                />
            </Col>
            <Col lg={11} md={11} sm={11} xs={11} className={styles.header_container}>
                <span className={styles.highlight}>{owner?.name} {owner?.last_name}</span> comentó {" "}
                <span className={styles.dot}></span>
                <span className={styles.post_date}> {commentData.fecha_creacion} : </span>

                {user.user.id === owner?.id &&
                    <div className={styles.more_options}>
                        <IconButton onClick={handleOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                }
                <div className={styles.collapse_container} style={openMoreOptions ? { display: 'unset' } : { display: 'none' }}>
                    <div className={styles.collapse_body}>
                        <Modal
                            title="¿Seguro que deseas eliminar esta novedad?"
                            body={<DeleteForm data={commentData} handleSubmitAction={handleDeletePost} />}
                            close={handleOpen}
                            button={
                                <span className={styles.options_label}> <Delete /> <span className={styles.options_label_description}>Eliminar</span></span>
                            }
                        />
                        <Modal
                            title="Editar Comentario"
                            body={
                                <EditPostForm
                                    postData={commentData}
                                    handleSubmitPost={handleEditPost}
                                />
                            }
                            close={handleOpen}
                            button={
                                <span className={styles.options_label}><EditIcon /> <span className={styles.options_label_description}>Editar</span></span>
                            }
                        />
                    </div>
                </div>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <span className={styles.comment_body}>{commentData.cuerpo}</span>
                        {
                            !!commentData.adjuntos.length && commentData.adjuntos.map((file, i) => {
                                return (
                                    <div className={styles.file_container} onClick={() => handleOpenFile(file.file)}>{file.upload_name}</div>
                                )
                            })

                        } 
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Comment;