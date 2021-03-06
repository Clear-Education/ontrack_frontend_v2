import React, { useState, useEffect } from "react";

// Import dependencias
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slide from "@material-ui/core/Slide";

// Import componentes
import styles from "./styles.module.css";


/**
 *
 * @param {boolean} show - Se tiene que llamar con el booleano que lo activa y desactiva. Ej: con swr se pasa el isValidating
 */
const BackgroundLoader = ({ show }) => {

  const SlideTransition = (props) => {
    const dir = 'down';
    return <Slide {...props} direction = {dir} />;
  };

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    setTimeout(() => {
      setState({ ...state, open: show });
    }, 250);
  }, [show]);

  return (
    <div style={{zIndex:'100'}}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        TransitionComponent={SlideTransition}
      >
        <div id={styles.loader_container}>
          <>
          <CircularProgress
            size={18}
            color="primary"
            className={styles.circular_progress}
          />
          Actualizando...
          </>
        </div>
      </Snackbar>
    </div>
  );
};

export default BackgroundLoader;
