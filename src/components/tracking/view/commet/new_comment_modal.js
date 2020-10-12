import { useState } from "react";
import styles from './styles.module.scss'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

const { Dialog, DialogTitle, DialogContent, Slide, DialogActions, IconButton } = require("@material-ui/core")

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NewCommentModal = (props) => {


    const [show, setShow] = useState(false);
    const handleVisibilityModal = (value) => {
        setShow(value);
    }


    return (
        <>
            {show ?
                <Dialog
                    open={show}
                    onClose={() => handleVisibilityModal(false)}
                    TransitionComponent={Transition}
                    className="responsive_modal center"
                    fullScreen
                >
                    <img
                        onClick={() => handleVisibilityModal(false)}
                        src="/icons/close.svg"
                        className={styles.close_modal}
                    />
                    <DialogTitle className={styles.modal_title}>Nuevo Comentario</DialogTitle>
                    <DialogContent>
                        <div>
                            nuevo comentario
                        </div>
                    </DialogContent>
                    <DialogActions>
                        acciones
                    </DialogActions>
                </Dialog>
                :
                <IconButton title="Agrega un comentario" onClick={()=>handleVisibilityModal(true)}>
                    <ChatBubbleOutlineIcon />
                </IconButton>
            }
        </>
    )
}


export default NewCommentModal