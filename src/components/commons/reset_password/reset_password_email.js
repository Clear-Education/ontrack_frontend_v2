import { Dialog, DialogContent, DialogTitle, TextField, FormControl, DialogActions, InputLabel, OutlinedInput, InputAdornment, IconButton, Slide, FormHelperText } from "@material-ui/core"
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";
import { resetUserPasswordService } from "../../../utils/user/service/user_services";
import styles from './styles.module.scss';
import Alert from "react-s-alert";

const INITIAL_STATE = {
    email: '',
    newPass: '',
    newPass2: '',
    showPassword: false,
    showPassword2: false
}

const INITIAL_VALIDATION = {
    email: false,
    newPass: false,
    newPass2: false
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const ResetPasswordEmailModal = ({handleCloseResetModal}) => {
    const [open, setOpen] = useState(true);
    const [state, setState] = useState(INITIAL_STATE);
    const [validation, setValidation] = useState(INITIAL_VALIDATION);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = (e) => {
        e.preventDefault();
        if(!validation.email && state.email !== undefined){
            setLoading(true);
            resetUserPasswordService(state.email).then((result) => {
                setLoading(false);
                if (result.success) {
                    handleCloseModal();
                }
            })
        }else{
            Alert.error("Corrobore los campos")
        }

    }

    const hadleValidationEmail = (value) => {
        setValidation({
            ...validation,
            email: !email_regex.test(value.toLowerCase()),
        });
    };

    const handleChange = (prop) => (event) => {
        hadleValidationEmail(event.target.value);
        setState({ ...state, [prop]: event.target.value })
    }

    const handleCloseModal = () =>{
        setOpen(false);
        setTimeout(() => {
            handleCloseResetModal(false); 
        },100);
    }
    return (
        <Dialog
            open={open}
            className={'center'}
            TransitionComponent={Transition}
        >
            <img
                onClick={handleCloseModal}
                src="/icons/close.svg"
                className={styles.close_modal}
            />
            <DialogTitle>
                <span style={{ fontWeight: '600' }}>
                    Recuperar contraseña
                </span>
            </DialogTitle>
            <form onSubmit={handleResetPassword}>
                <DialogContent>
                    <p className={styles.body}>
                        Por favor, escribe tu email a continuación para comenzar con los pasos de recuperación de tus credenciales
                    </p>
                    <FormControl variant="outlined">
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={state.email}
                            onChange={handleChange("email")}
                            autoFocus={true}
                            error={validation.email}
                            required
                        />
                        {validation.email && (
                            <FormHelperText
                                className="helper-text"
                                style={{ color: "rgb(182, 60, 47)" }}
                            >
                                Debe respetar el formato x@x.x
                            </FormHelperText>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions style={{ marginRight: '18px' }}>
                    <button className="ontrack_btn add_btn" type="submit">{loading ? 'Enviando...' : 'Enviar email'}</button>
                </DialogActions>
            </form>
        </Dialog>
    )
}


export default ResetPasswordEmailModal;