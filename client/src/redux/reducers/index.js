import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import setting from "./settingReducer";

export default combineReducers({
  auth,
  alert,
  setting,
});
