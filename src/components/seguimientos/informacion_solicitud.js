import React from 'react';
import { Button, IconButton } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import InfoIcon from "../commons/icons/info_icon";
import { useState } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import styles from './styles.module.css'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const InformacionSolicitud = ({ data }) => {

    const [selected, setSelected] = useState('info');
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getSelected = (icon) => {
        if (icon === selected) {
            return 'var(--main-color-dark)'
        }
    }

    return (
        <Row lg={12} md={12} sm={12} xs={12}>

            <Col lg={12} md={12} sm={12} xs={12}>
                <Button onClick={handleClickOpen}>
                    <IconButton>
                        <InfoIcon color={getSelected('info')} />
                    </IconButton>
                </Button>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle className={styles.modal_title} id="alert-dialog-slide-title">{"Información de la Solicitud"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">

                            {Object.keys(data).filter(k => k != "current_step" && k != "anio_lectivo" && k != "year" && k != "department").map((key) => {
                                if (key == "alumnos") {
                                    const stringWithoutFirstLetter = key.slice(1)
                                    return (
                                        <div>
                                            <p className="subtitle mb-0"><b>{key.charAt(0).toUpperCase() + stringWithoutFirstLetter}:</b></p>
                                            <p>{data[key].join(",")}</p>
                                        </div>
                                    )

                                }
                                const stringWithoutFirstLetter = key.slice(1)
                                return <div>
                                    <p className="subtitle mb-0"><b>{key.charAt(0).toUpperCase() + stringWithoutFirstLetter}:</b></p>
                                    <p>{data[key]}</p>
                                </div>
                            })}

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Col>
        </Row >
    )

}

export default InformacionSolicitud;