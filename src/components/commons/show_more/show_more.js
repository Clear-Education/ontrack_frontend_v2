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
const ShowMore = ({ show, showMore }) => {

  const SlideTransition = (props) => {
    const dir = 'up';
    return <Slide {...props} direction={dir} />;
  };

  const [state, setState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    setState({ ...state, open: show });
    setTimeout(() => {
      setState({ ...state, open: !show });
    }, 2000);
  }, [show]);

  return (
    <div style={{ zIndex: '100' }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        TransitionComponent={SlideTransition}
        style={{
          left: '43%',
          right: 'auto',
          bottom: '40px'
        }}
      >
        <div id={styles.loader_container}
          onClick={showMore && showMore}
        >
          <p style={{ margin: '10px' }}>Mostrar más</p>
        </div>
      </Snackbar>
    </div>
  );
};

export default ShowMore;
