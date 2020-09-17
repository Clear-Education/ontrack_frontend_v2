import { Dialog, DialogContent, DialogTitle, TextField, FormControl, DialogActions, InputLabel, OutlinedInput, InputAdornment, IconButton, Slide, FormHelperText } from "@material-ui/core"
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { changeUserPasswordService } from "../../../utils/user/service/user_services";
import styles from './styles.module.scss';

const INITIAL_STATE = {
    oldPass: '',
    newPass: '',
    newPass2: '',
    showOldPass: false,
    showNewPass: false,
    showNewPass2: false
}

const INITIAL_VALIDATION = {
    oldPass: false,
    newPass: false
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const FirstLoginModal = ({user}) => {
    const [open, setOpen] = useState(true);
    const [state, setState] = useState(INITIAL_STATE);
    const [validation, setValidation] = useState(INITIAL_VALIDATION);
    const [loading, setLoading] = useState(false);

    const handleChangePassword = (e) => {
        e.preventDefault();
        const DATA = {
            password: state.oldPass,
            new_password: state.newPass,
            new_password2: state.newPass2
        }
        setLoading(true);
        changeUserPasswordService(DATA, user && user.token).then((result) => {
            setLoading(false);
            if (result.success) {
                setOpen(false);
            }
        })
    }

    const handleClickShowOldPassword = () => {
        setState({ ...state, showOldPass: !state.showOldPass });
    };
    const handleClickShowNewPassword = () => {
        setState({ ...state, showNewPass: !state.showNewPass });
    };

    const handleClickShowNewPassword2 = () => {
        setState({ ...state, showNewPass2: !state.showNewPass2 });
    };

    const handleValidation = (name, value) => {
        if (name === 'oldPass' || name === 'newPass') {
            setValidation({ ...validation, [name]: !(value.trim().length > 0) })
        }
        if (name === 'newPass2') {
            setValidation({ ...validation, [name]: state.newPass !== value })
        }
    }
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        handleValidation(prop, event.target.value);
        setState({ ...state, [prop]: event.target.value })
    }
    return (
        <Dialog
            open={open}
            className={'center'}
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <span style={{ fontWeight: '600' }}>
                    ¡ Bienvenido <spas className={styles.name_label}>{user && user.name}</spas> !
                </span>
            </DialogTitle>
            <form onSubmit={handleChangePassword}>
                <DialogContent>
                    <p className={styles.body}>
                        Gracias por registrare en OnTrack. Por motivos de seguiridad, al ser tu primer inicio de sesión, te pediremos que cambies tu contraseña!
                    </p>
                    <p className={styles.body_advice}>
                       Recuerda la contraseña nueva no puede ser igual a la actual
                    </p>    
                    <FormControl variant="outlined">
                        <InputLabel
                            className="password-label"
                            htmlFor="password"
                        >
                            Contraseña brindada por el administrador
                        </InputLabel>
                        <OutlinedInput
                            required
                            id="oldPass"
                            type={state.showOldPass ? "text" : "password"}
                            value={state.oldPass}
                            onChange={handleChange("oldPass")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowOldPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {state.showOldPass ? (
                                            <Visibility style={{ color: "#bebebe" }} />
                                        ) : (
                                                <VisibilityOff style={{ color: "#bebebe" }} />
                                            )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={90}
                        />
                    </FormControl>
                    {validation.oldPass && (
                        <FormHelperText
                            className="helper-text"
                            style={{ color: "rgb(182, 60, 47)" }}
                        >
                            Este campo es obligatorio
                        </FormHelperText>
                    )}
                    <FormControl variant="outlined" style={{ marginTop: 10 }}>
                        <InputLabel
                            className="password-label"
                            htmlFor="password"
                        >
                            Contraseña nueva
                        </InputLabel>
                        <OutlinedInput
                            required
                            id="newPass"
                            type={state.showNewPass ? "text" : "password"}
                            value={state.newPass}
                            onChange={handleChange("newPass")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {state.showNewPass ? (
                                            <Visibility style={{ color: "#bebebe" }} />
                                        ) : (
                                                <VisibilityOff style={{ color: "#bebebe" }} />
                                            )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={90}
                        />

                    </FormControl>
                    {validation.newPass && (
                        <FormHelperText
                            className="helper-text"
                            style={{ color: "rgb(182, 60, 47)" }}
                        >
                            Este campo es obligatorio
                        </FormHelperText>
                    )}

                    <FormControl variant="outlined" style={{ marginTop: 10 }}>
                        <InputLabel
                            className="password-label"
                            htmlFor="password"
                        >
                            Repetir Contraseña
                        </InputLabel>
                        <OutlinedInput
                            required
                            id="newPass"
                            type={state.showNewPass2 ? "text" : "password"}
                            value={state.newPass2}
                            onChange={handleChange("newPass2")}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword2}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {state.showNewPass2 ? (
                                            <Visibility style={{ color: "#bebebe" }} />
                                        ) : (
                                                <VisibilityOff style={{ color: "#bebebe" }} />
                                            )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={90}
                        />

                    </FormControl>
                    {validation.newPass2 && (
                        <FormHelperText
                            className="helper-text"
                            style={{ color: "rgb(182, 60, 47)" }}
                        >
                            Las contraseñas no coinciden
                        </FormHelperText>
                    )}


                </DialogContent>
                <DialogActions style={{ marginRight: '18px' }}>
                    <button className="ontrack_btn add_btn" type="submit">{loading ? 'Cargando...' : 'Cambiar contraseña'}</button>
                </DialogActions>
            </form>
        </Dialog>
    )
}


export default FirstLoginModal;