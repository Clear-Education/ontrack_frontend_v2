import { ListItem, Checkbox, ListItemText, List } from "@material-ui/core";
import { useState, useEffect } from "react";
import styles from './styles.module.scss';
import { getStudentGoalsService, editGoalsStateService } from '../../../../utils/goals/services/goals_services'
import { useSelector } from "react-redux";


const GoalsViewer = ({ student, tracking }) => {

  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState(null);
  const user = useSelector((store) => store.user);

  async function getStudentGoals() {
    await getStudentGoalsService(user.user.token, student.id, tracking.id).then((result) => {
      setGoals(result.result.filter(objetivo => !objetivo.objetivo?.valor_objetivo_cuantitativo));
    })
  }

  useEffect(() => {
    setLoading(false);
  }, [])

  useEffect(() => {
    if (student) {
      getStudentGoals();
    }
  }, [student]);

  const handleCheck = (idGoal, e) => {
    const data = {
      id: idGoal,
      alumno: student.id,
      alcanzada: e.target.checked
    }

    editGoalsStateService(data, user.user.token).then((result => {
      if (result.success) {
        getStudentGoals()
      }
    }))
  }

  return (
    goals ?
      <List style={{maxHeight:'300px', overflow:'auto'}}>
        {goals.map((goal) => {
          const labelId = goal.objetivo?.descripcion;
          return (
            <ListItem key={goal.objetivo?.id}>
              <Checkbox
                checked={goal.alcanzada}
                onClick={(e) => { handleCheck(goal.objetivo?.id, e) }}
              />
              <ListItemText id={labelId} primary={goal.objetivo?.descripcion} className={goal.complete ? styles.complete : ''} />
            </ListItem>
          )
        })
        }
      </List>
      :
      null
  )
}

export default GoalsViewer;