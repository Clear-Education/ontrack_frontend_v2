import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import { Avatar, IconButton, Collapse, List } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useState } from "react";
import Comment from "../commet/comment";
import NewCommentModal from "../commet/new_comment/new_comment_modal";
import Delete from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import config from "../../../../utils/config";
import Modal from '../../../commons/modals/modal';
import { deleteNovedadesService, editNovedadesService } from "../../../../utils/novedades/services/novedades_services";
import { useSelector } from "react-redux";
import DeleteForm from "../../../commons/delete_form/deleteForm";
import { parsePostData } from "../../../../utils/general_services/services";
import { mutate } from "swr";
import NewPost from "../new_post/new_post";
import EditPostForm from "./edit_post";

const Post = ({ postData, handleSubmitPost }) => {

    const [openComments, setOpenComments] = useState(false);
    const owner = postData?.usuario?.usuario;
    const tracking = postData?.seguimiento;
    const comments = postData?.comentarios;
    const user = useSelector((store) => store.user);
    const [openMoreOptions, setOpenMoreOptions] = useState(false);
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
            id: postData?.id,
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
                <span className={styles.highlight}>{owner?.name} {owner?.last_name}</span> publicó en
                <span className={styles.highlight}>: {tracking.nombre} </span>
                <span className={styles.dot}></span>
                <span className={styles.post_date}> {postData?.fecha_creacion} : </span>
                <div className={styles.more_options}>
                    {user.user.id === owner?.id &&
                        <IconButton onClick={handleOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    <div className={styles.collapse_container} style={openMoreOptions ? { display: 'unset' } : { display: 'none' }}>
                        <div className={styles.collapse_body}>
                            <Modal
                                title="¿Seguro que deseas eliminar esta novedad?"
                                body={<DeleteForm data={postData} handleSubmitAction={handleDeletePost} />}
                                close={handleOpen}
                                button={
                                    <span className={styles.options_label}> <Delete /> <span className={styles.options_label_description}>Eliminar</span></span>
                                }
                            />
                            <Modal
                                title="Editar Publicación"
                                body={
                                    <EditPostForm
                                        postData={postData}
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
                </div>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <p className="text-break">
                            {postData?.cuerpo}
                        </p>
                        <div style={{ overflow: 'auto', display: 'flex' }}>
                            {postData?.adjuntos.map((file, i) => {
                                const url = file.file;
                                return <div className={styles.file_container} onClick={() => handleOpenFile(url)}>{file.upload_name}</div>
                            })}
                        </div>
                    </Col>
                </Row>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={styles.comments_actions}>
                <span className={styles.comments_label} onClick={() => !!comments.length ? setOpenComments(!openComments) : null}>{openComments ? 'Ocultar comentarios' : !!comments.length ? `Ver ${comments.length} comentarios` : 'Sin comentarios'}</span>
                <NewCommentModal postData={postData} handleSubmitPost={handleSubmitPost} />
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={styles.comments_container}>
                <Collapse in={openComments} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                        {
                            comments.map((comment, i) => {
                                return (
                                    <div className={styles.comment_container} key={i}>
                                        <Comment commentData={parsePostData(comment, tracking)} />
                                    </div>
                                )

                            })
                        }

                    </List>
                </Collapse>
            </Col>
        </Row>
    )
}

export default Post;