// Import Componentes
import * as types from "../types";
import { login, logout } from "../../src/utils/Auth";

// Import Dependencias
import Alert from "react-s-alert";


export const loginAction = (username, password) => {
  return async (dispatch) => {
    dispatch({ type: types.LOADING_USER });
    return login(username, password).then((result) => {
      if (result.isLoggedIn) {
        if(result.user.first_login){
          return {success: true, first_login: true, user: result.user}
        }else{
          dispatch({ type: types.LOGIN, payload: result.user });
          return {success:true}
        }
      } else {
        dispatch({ type: types.NO_LOADING_USER });
        result.result.forEach((element) => {
          Alert.error(element.message,
            {
              effect: "stackslide",
              html: true,
            }
          );
        });
        return false;
      }
    });
  };
};

export const logoutAction = (auth_token) => async (dispatch) => {
  dispatch({ type: types.RESET_TRACKING_SOLICITUD_DATA })
  dispatch({ type: types.RESET_TRACKING_DATA })
  dispatch({ type: types.LOADING_USER });
  return logout(auth_token).then((result) => {
    dispatch({ type: types.NO_LOADING_USER });
    if (result.success) {
      Alert.success("¡Sesión finalizada correctamente!", {
        effect: "stackslide",
      });
      dispatch({ type: types.LOGOUT });
      return result
    } else {
      result.result.forEach((element) => {
        Alert.error(element.message, {
          effect: "stackslide",
        });
      });
      return false;
    }
  });
};

export const forcedLogout = () => async (dispatch) => {
  return dispatch({ type: types.LOGOUT });
};


export const updateUser = (data) => async (dispatch) => {
  return dispatch({ type: types.UPDATE_USER, payload: data })
}