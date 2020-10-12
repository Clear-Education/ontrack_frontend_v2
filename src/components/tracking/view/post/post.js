import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
import { Avatar, IconButton, Collapse, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useEffect, useState } from "react";
import Comment from "../commet/comment";
import NewCommentModal from "../commet/new_comment_modal";

const Post = ({ postData }) => {

    const [openComments, setOpenComments] = useState(false);
    const user = postData.usuario.usuario;
    const tracking = postData.seguimiento;
    const comments = postData.comentarios;
    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>
            <Col lg={1} md={1} sm={1} xs={1}>
                <Avatar />
            </Col>
            <Col lg={11} md={11} sm={11} xs={11} className={styles.header_container}>
                <span className={styles.highlight}>{user.name} {user.last_name}</span> publicó en
                <span className={styles.highlight}> seguimiento: {tracking.nombre} </span>
                <span className={styles.dot}></span>
                <span className={styles.post_date}> {postData.fecha_creacion} : </span>
                <div className={styles.more_options}>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
                <Row lg={12} md={12} sm={12} xs={12} className={styles.content_container}>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        {postData.cuerpo}
                        <div style={{ overflow: 'auto', display: 'flex' }}>
                            {postData.adjuntos.map((file)=>{
                                <img src={file?.file} className={styles.post_image}/>
                            })}
                        </div>
                    </Col>
                </Row>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={styles.comments_actions}>
                <span className={styles.comments_label} onClick={() => !comments.length ? setOpenComments(!openComments) : null}>{openComments ? 'Ocultar comentarios' : !!comments.length ? `Ver ${comments.length} comentarios` : 'No hay comentarios, se el primero!'}</span>
                <NewCommentModal />
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={styles.comments_container}>
                <Collapse in={openComments} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <div className={styles.comment_container}>
                            <Comment />
                        </div>
                    </List>
                </Collapse>
            </Col>
        </Row>
    )
}

export default Post;