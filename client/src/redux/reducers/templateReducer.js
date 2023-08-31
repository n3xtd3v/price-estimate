import { TEMPLATE_ACTION } from "../actions/templateAction";

const initialState = {
  templates: [],
  itemsPrice: [],
  printId: "",
};

const templateReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEMPLATE_ACTION.POST_TEMPLATE:
      return {
        ...state,
        templates: action.payload,
      };
    case TEMPLATE_ACTION.GET_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
      };
    case TEMPLATE_ACTION.GET_TEMPLATES_ITEMS_DETAIL:
      return {
        ...state,
        itemsPrice: action.payload,
      };

    case TEMPLATE_ACTION.DELETE_TEMPLATE:
      return {
        ...state,
        templates: action.payload,
      };
    case TEMPLATE_ACTION.POST_PRINTTEMPLATE:
      return {
        ...state,
        printId: action.payload,
      };
    default:
      return state;
  }
};

export default templateReducer;
