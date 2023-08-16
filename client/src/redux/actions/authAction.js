import { GLOBALTYPES } from "./globalTypes";
import { postDataAPI } from "../../utils/fetchData";

export const signin = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI("signin", data);

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.token,
        user: res.data.user,
      },
    });

    localStorage.setItem("firstLogin", true);

    dispatch({ type: GLOBALTYPES.ALERT, payload: {} });

    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");

  if (firstLogin) {
    try {
      const res = await postDataAPI("refresh_token");

      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.token,
          user: res.data.user,
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  }
};

export const signout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");

    await postDataAPI("signout");

    window.location.href = "/signin";
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};
