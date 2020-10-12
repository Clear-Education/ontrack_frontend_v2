import { FormLabel, TextField, FormControl, FormHelperText, IconButton } from "@material-ui/core";
import Delete from '@material-ui/icons/Delete';
import { Row, Col } from "react-bootstrap";
import styles from './styles.module.scss';
const { useState, useEffect } = require("react")

const OnlineAddItemList = ({ labelText, handleList, previousItems, editable }) => {

    const [listItems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [validateItem, setValidateItem] = useState(false);

    useEffect(() => {
        if (previousItems.length > 0) {
            setListItems(previousItems);
        }
    }, [previousItems])

    const handleChange = (event) => {
        setNewItem(event.target.value);
        handleValidation(event.target.value);
    }

    const handleAddItem = (event) => {
        if (event.key === 'Enter') {
            const VALID_DATA = handleValidation(newItem);
            if (!VALID_DATA) {
                handleList('add', newItem).then((result) => {
                    if (result.success) {
                        let newList = [...listItems];
                        let newData = {
                            id: result.result.id,
                            descripcion: newItem
                        }
                        newList.push(newData);
                        setListItems(newList);
                        setNewItem("");
                    }
                })
            }
        }
    }

    const handleDeleteItem = (index, id) => {
        handleList('delete', id).then((result) => {
            if (result.success) {
                let newList = [...listItems];
                newList.splice(index, 1);
                setListItems(newList);
            }
        })
    }

    const handleValidation = (value) => {
        const VALIDATION = !(value.length > 25);
        setValidateItem(VALIDATION);
        return VALIDATION;
    }

    return (
        <>
            <Row lg={12} md={12} sm={12} xs={12} style={{ margin: 'auto', marginTop: '10px' }}>
                {
                    !!listItems.length ?
                        listItems.map((item, index) => {
                            return (
                                <Col lg={12} md={12} sm={12} xs={12}
                                    className={styles.item_container}
                                    key={index}
                                    style={!editable ? { paddingTop: '3px', paddingBottom: '3px' } : { padding: '15px' }}
                                >
                                    {item.descripcion}
                                    {
                                        !editable &&
                                        <IconButton onClick={() => handleDeleteItem(index, item.id)}>
                                            <Delete />
                                        </IconButton>
                                    }
                                </Col>
                            )
                        })
                        :
                        <span style={{ marginBottom: '20px' }}>No hay objetivos creados por el momento. Creá uno!</span>
                }
            </Row>
            {
                !editable &&
                <>
                    <FormControl variant="outlined">
                        <FormLabel className="left" component="legend">{labelText} presionando ENTER</FormLabel>
                        <TextField
                            id="newItem"
                            name="newItem"
                            variant="outlined"
                            value={newItem}
                            onChange={handleChange}
                            onKeyPress={handleAddItem}
                            required
                            style={{
                                padding: '0'
                            }}
                        />
                    </FormControl >
                    {
                        validateItem && (
                            <FormHelperText
                                className="helper-text"
                                style={{ color: "rgb(182, 60, 47)" }}
                            >
                                Este campo debe superar el minimo de caracteres. Sea descriptivo
                            </FormHelperText>
                        )
                    }
                </>
            }

        </>
    )
}

export default OnlineAddItemList;