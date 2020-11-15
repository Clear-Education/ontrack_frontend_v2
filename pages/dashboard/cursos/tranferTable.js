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
    const [studentsToDelete, setStudentsToDelete] = useState([]);
    const [studentsToAdd, setStudentsToAdd] = useState([]);
    const [checked, setChecked] = useState([]);
    const leftChecked = intersection(checked, studentsToDelete);
    const rightChecked = intersection(checked, studentsToAdd);

    useEffect(() => {
        getStudentsService(user.user.token, data.school_year).then((result) => {
            const STUDENTS = result.result.results;
            setStudentsToDelete(STUDENTS)
            changeAction('studentsToDelete',STUDENTS);
        })
    }, []);

    useEffect(() => {
        getStudentsCourseService(user.user.token, data.curso, data.school_year).then((result) => {
            let students = [];
            result.result.results.forEach((element) => {
                students.push(element.alumno);
            })
            setStudentsToAdd(students);
            changeAction('studentsToAdd',students);
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

    const setData = (studentsToAdd,studentsToDelete,_checked) =>{
        setStudentsToAdd(studentsToAdd);
        setStudentsToDelete(studentsToDelete);
        changeAction('studentsToAdd',studentsToAdd);
        changeAction('studentsToDelete',studentsToDelete);
        if (_checked) setChecked(_checked);
    }

    const handleAllRight = () => {
        const STUDENTS_TO_ADD = studentsToAdd.concat(studentsToDelete);
        const STUDENTS_TO_DELETE = [];
        setData(STUDENTS_TO_ADD,STUDENTS_TO_DELETE);
    };

    const handleCheckedRight = () => {
        const STUDENTS_TO_ADD = studentsToAdd.concat(leftChecked);
        const STUDENTS_TO_DELETE = not(studentsToDelete, leftChecked);
        const CHECKED = not(checked, leftChecked);
        setData(STUDENTS_TO_ADD,STUDENTS_TO_DELETE,CHECKED);
    };

    const handleAllLeft = () => {
        const STUDENTS_TO_ADD = [];
        const STUDENTS_TO_DELETE = studentsToDelete.concat(studentsToAdd);
        setData(STUDENTS_TO_ADD,STUDENTS_TO_DELETE);
    };

    const handleCheckedLeft = () => {
        const STUDENTS_TO_ADD = not(studentsToAdd, rightChecked);
        const STUDENTS_TO_DELETE = studentsToDelete.concat(rightChecked);
        const CHECKED = not(checked, rightChecked);
        setData(STUDENTS_TO_ADD,STUDENTS_TO_DELETE,CHECKED);
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
                            <ListItemText primary={`${value.nombre} ${value.apellido} - Legajo: ${value.legajo}`} />
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
                    {customList(studentsToDelete)}
                </Grid>

                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={studentsToDelete.length === 0}
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
                            disabled={studentsToAdd.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                
                <Grid item className={styles.grid_item_container}>
                    <span className={styles.grid_title}>Alumnos del curso</span>
                    {customList(studentsToAdd)}
                </Grid>
            </Grid>
        </div>
    );
}


export default TransferList;