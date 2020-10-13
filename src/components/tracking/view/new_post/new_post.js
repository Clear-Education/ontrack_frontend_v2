import { Row, Col } from "react-bootstrap";
import SendIcon from '@material-ui/icons/Send';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import styles from './styles.module.scss';
import { useEffect, useState } from "react";
import FileInput from "../../../commons/file_uploader";
import { IconButton } from "@material-ui/core";


const INITIAL_STATE = {
    cuerpo: "",
    files: [],
    padre:'',
}


const NewPost = ({ handleSubmitPost, padre, handleModal, postData }) => {

    const [state, setState] = useState(INITIAL_STATE);

    useEffect(()=>{
        if(padre){
            setState({...state,padre:padre})
        }
        if(postData){
            setState({...state,cuerpo:postData.cuerpo, files:postData.aduntos})
        }
    },[])

    const handleChange = (prop) => (e) => {
        const VALUE = e.target.value;
        setState({ ...state, [prop]: VALUE });
    }

    const handleFileChange = (files) => {
        setState({ ...state, files: files })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSubmitPost(state).then((result)=>{
            if(result.success){
                handleModal && handleModal(false);
            }
            setState(INITIAL_STATE);
        });
    }
    return (
        <Row lg={12} md={12} sm={12} xs={12} className={styles.container}>

            <Col lg={12} md={12} sm={12} xs={12}>
                <form onSubmit={handleSubmit}>
                    <FormControl variant="outlined">
                        <TextField
                            multiline
                            value={state.cuerpo}
                            label={padre ? "Respuesta" : "Publica alguna novedad"}
                            InputLabelProps={{ style: { color: 'var(--black) !important' } }}
                            rowsMax={3}
                            onChange={handleChange('cuerpo')}
                            required
                        />
                    </FormControl>
                    <div className={styles.send_container}>
                        <IconButton type="submit">
                            <SendIcon />
                        </IconButton>
                    </div>
                </form>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className={styles.bottom_container}>
                <FileInput handleChange={handleFileChange} files={state.files}/>
            </Col>
        </Row>
    )
}

export default NewPost;