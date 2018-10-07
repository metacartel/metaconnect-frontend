import { updateLocal } from "../helpers/localstorage";
import { accountUpdateMetaConnections } from "./_account";

// -- Constants ------------------------------------------------------------- //
const METACONNECTION_SHOW = "metaConnection/METACONNECTION_SHOW";

const METACONNECTION_HIDE = "metaConnection/METACONNECTION_HIDE";

// -- Actions --------------------------------------------------------------- //

const localStorageKey = "METACONNECTIONS";

export const metaConnectionShow = ({
  request,
  name,
  socialMedia
}) => dispatch => {
  dispatch({
    type: METACONNECTION_SHOW,
    payload: { request, name, socialMedia }
  });
};

export const metaConnectionHide = () => dispatch => {
  window.browserHistory.push("/dashboard");
  dispatch({ type: METACONNECTION_HIDE });
};

export const metaConnectionApprove = () => (dispatch, getState) => {
  const { name, socialMedia } = getState().metaConnection;
  const newMetaConnection = { [name]: { name, socialMedia } };
  updateLocal(localStorageKey, newMetaConnection);
  const { metaConnections } = getState().account;
  dispatch(
    accountUpdateMetaConnections({ ...metaConnections, ...newMetaConnection })
  );
  dispatch(metaConnectionHide());
};
export const metaConnectionReject = () => dispatch => {
  dispatch(metaConnectionHide());
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  request: false,
  name: "",
  socialMedia: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case METACONNECTION_SHOW:
      return {
        ...state,
        request: action.payload.request,
        name: action.payload.name,
        socialMedia: action.payload.socialMedia
      };
    case METACONNECTION_HIDE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
