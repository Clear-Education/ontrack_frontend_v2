import { combineReducers } from 'redux'
import userReducer from '../reducers/userReducer'
import currentTrackingReducer from './currentTrackingReducer';
import trackingReducer from './trackingReducer';
import trackingSolicitudReducer from './trackingSolicitudReducer';

export default combineReducers({
    user: userReducer,
    tracking: trackingReducer,
    currentTracking: currentTrackingReducer,
    trackingSolicitud: trackingSolicitudReducer
});