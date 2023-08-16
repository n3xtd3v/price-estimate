import { SETTING_ACTION } from "../actions/settingAction";

const initialState = {
  users: "",
};

const settingAction = (state = initialState, action) => {
  switch (action.type) {
    case SETTING_ACTION.GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case SETTING_ACTION.IS_ACTIVE_SWITCH:
      return {
        ...state,
        users: action.payload,
      };
    case SETTING_ACTION.TAKE_ROLE_ADMIN:
      return {
        ...state,
        users: action.payload,
      };
    case SETTING_ACTION.TAKE_ROLE_SUPERVISOR:
      return {
        ...state,
        users: action.payload,
      };
    case SETTING_ACTION.TAKE_ROLE_STAFF:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};

export default settingAction;
