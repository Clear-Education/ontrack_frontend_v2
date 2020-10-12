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
const BackgroundLoader = ({ show, showMore }) => {

  const SlideTransition = (props) => {
    const dir = showMore ? 'up' : 'down';
    return <Slide {...props} direction = {dir} />;
  };

  const [state, setState] = useState({
    open: false,
    vertical: showMore ? 'bottom' : 'top',
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    setTimeout(() => {
      setState({ ...state, open: show });
    }, showMore ? 0 : 250);
  }, [show]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        TransitionComponent={SlideTransition}
      >
        <div id={styles.loader_container} 
            style={showMore && {cursor:'pointer'}} 
            onClick={showMore && showMore}
            >
          {showMore ? 
            <p style={{margin:'10px'}}>Mostrar más</p>
          :
          <>
          <CircularProgress
            size={18}
            color="primary"
            className={styles.circular_progress}
          />
          Actualizando...
          </>
          }
        </div>
      </Snackbar>
    </div>
  );
};

export default BackgroundLoader;
