import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import setting from "./settingReducer";
import template from "./templateReducer";

export default combineReducers({
  auth,
  alert,
  setting,
  template,
});
