import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { getStudentsCourseService, getStudentsService } from '../../../src/utils/student/service/student_service';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss'

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const TransferList = ({ changeAction, data }) => {

    const user = useSelector((store) => store.user);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [checked, setChecked] = useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        getStudentsService(user.user.token, data.school_year).then((result) => {
            setLeft(result.result.results)
        })
    }, []);

    useEffect(() => {
        getStudentsCourseService(user.user.token, data.curso, data.school_year).then((result) => {
            let students = [];
            result.result.results.forEach((element) => {
                students.push(element.alumno);
            })
            setRight(students);
        })
    }, []);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleAllRight = () => {
        const DATA = right.concat(left);
        setRight(DATA);
        changeAction('students',DATA);
        setLeft([]);
    };

    const handleCheckedRight = () => {
        const DATA = right.concat(leftChecked);
        setRight(DATA);
        changeAction('students',DATA);
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
        changeAction('students',[]);
    };

    const handleCheckedLeft = () => {
        const DATA = not(right, rightChecked);
        setLeft(left.concat(rightChecked));
        setRight(DATA);
        changeAction('students',DATA);
        setChecked(not(checked, rightChecked));
    };


    const customList = (data) => (
        <Paper>
            <List dense component="div" role="list"  style={!!data.length ? {display:'unset'} : {display:'none'}}>
                {data.map((value) => {
                    return (
                        <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${value.nombre} ${value.apellido}`} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <div className={styles.grid_container}>
            <Grid container spacing={2} justify="center" alignItems="center">

                <Grid item className={styles.grid_item_container}>
                <span className={styles.grid_title}>Alumnos disponibles</span>
                    {customList(left)}
                </Grid>

                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                
                <Grid item className={styles.grid_item_container}>
                    <span className={styles.grid_title}>Alumnos del curso</span>
                    {customList(right)}
                </Grid>
            </Grid>
        </div>
    );
}


export default TransferList;