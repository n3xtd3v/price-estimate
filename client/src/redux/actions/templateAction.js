import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, postDataAPI, deleteDataAPI } from "../../utils/fetchData";

export const TEMPLATE_ACTION = {
  POST_TEMPLATE: "POST_TEMPLATE",
  GET_TEMPLATES: "GET_TEMPLATES",
  GET_TEMPLATES_ITEMS_DETAIL: "GET_TEMPLATES_ITEMS_DETAIL",
  DELETE_TEMPLATE: "DELETE_TEMPLATE",
  POST_PRINTTEMPLATE: "POST_PRINTTEMPLATE",
};

export const postTemplate =
  ({ token }, data) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      const res = await postDataAPI("template", data, token);

      dispatch({
        type: TEMPLATE_ACTION.POST_TEMPLATE,
        payload: res.data.templates,
      });

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: res.data.msg,
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
  };

export const getTemplateByUID = (data) => async (dispatch) => {
  try {
    const res = await getDataAPI("templates", data.token);

    dispatch({
      type: TEMPLATE_ACTION.GET_TEMPLATES,
      payload: res.data.templates,
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const getTemplateItemsDetail =
  ({ token }, data) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI(`template/${data.selectedTemplate}`, token);

      dispatch({
        type: TEMPLATE_ACTION.GET_TEMPLATES_ITEMS_DETAIL,
        payload: res.data.templates,
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const deleteTemplate =
  ({ token }, data) =>
  async (dispatch) => {
    try {
      const res = await deleteDataAPI(
        `template/${data.selectedTemplate}`,
        token
      );

      dispatch({
        type: TEMPLATE_ACTION.DELETE_TEMPLATE,
        payload: res.data.templates,
      });

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };

export const postPrintTemplate =
  ({ token }, data) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("print-template", data, token);

      console.log(res);
      dispatch({
        type: TEMPLATE_ACTION.POST_PRINTTEMPLATE,
        payload: res.data.printTemplateUID,
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response.data.msg,
        },
      });
    }
  };
