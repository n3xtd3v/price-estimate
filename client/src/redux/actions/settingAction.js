import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";

export const SETTING_ACTION = {
  GET_USERS: "GET_USERS",
  IS_ACTIVE_SWITCH: "IS_ACTIVE_SWITCH",
  IS_PRINT_SWITCH: "IS_PRINT_SWITCH",
  TAKE_ROLE_ADMIN: "TAKE_ROLE_ADMIN",
  TAKE_ROLE_SUPERVISOR: "TAKE_ROLE_SUPERVISOR",
  TAKE_ROLE_STAFF: "TAKE_ROLE_STAFF",
};

export const getUsersSetting =
  ({ token }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      const res = await getDataAPI("users", token);

      dispatch({
        type: SETTING_ACTION.GET_USERS,
        payload: res.data.users,
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const isActiveSwitch =
  ({ token }, selected) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI("users", selected, token);

      dispatch({
        type: SETTING_ACTION.IS_ACTIVE_SWITCH,
        payload: res.data.users,
      });

      location.reload();
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const isPrintSwitch =
  ({ token }, selected) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI("users/print", selected, token);

      dispatch({
        type: SETTING_ACTION.IS_PRINT_SWITCH,
        payload: res.data.users,
      });

      location.reload();
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const takeRoleAdmin =
  ({ token }, selected) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI("users/admin", selected, token);

      dispatch({
        type: SETTING_ACTION.IS_ACTIVE_SWITCH,
        payload: res.data.users,
      });

      location.reload();
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const takeRoleSupervisor =
  ({ token }, selected) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI("users/supervisor", selected, token);

      dispatch({
        type: SETTING_ACTION.TAKE_ROLE_SUPERVISOR,
        payload: res.data.users,
      });

      location.reload();
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const takeRoleStaff =
  ({ token }, selected) =>
  async (dispatch) => {
    try {
      const res = await patchDataAPI("users/staff", selected, token);

      dispatch({
        type: SETTING_ACTION.TAKE_ROLE_STAFF,
        payload: res.data.users,
      });

      location.reload();
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };
