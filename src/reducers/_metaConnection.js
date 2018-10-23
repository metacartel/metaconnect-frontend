import { updateLocal } from "../helpers/localstorage";
import { accountUpdateMetaConnections } from "./_account";
import { p2pRoomSendMessage } from "./_p2pRoom";

// -- Constants ------------------------------------------------------------- //
const METACONNECTION_SHOW = "metaConnection/METACONNECTION_SHOW";

const METACONNECTION_HIDE = "metaConnection/METACONNECTION_HIDE";

// -- Actions --------------------------------------------------------------- //

const localStorageKey = "METACONNECTIONS";

export const metaConnectionShow = ({
  peer,
  request,
  name,
  socialMedia
}) => dispatch => {
  dispatch({
    type: METACONNECTION_SHOW,
    payload: { peer, request, name, socialMedia }
  });
  window.browserHistory.push("/meta-connection");
};

export const metaConnectionHide = () => dispatch => {
  window.browserHistory.push("/dashboard");
  dispatch({ type: METACONNECTION_HIDE });
};

export const metaConnectionApprove = () => (dispatch, getState) => {
  const userName = getState().account.name;
  const { peer, name, socialMedia } = getState().metaConnection;
  const newMetaConnection = { [name]: { name, socialMedia } };
  updateLocal(localStorageKey, newMetaConnection);
  const { metaConnections } = getState().account;
  const response = { name: userName, approved: true, rejected: false };
  dispatch(p2pRoomSendMessage(peer, response));
  dispatch(
    accountUpdateMetaConnections({ ...metaConnections, ...newMetaConnection })
  );
  dispatch(metaConnectionHide());
};
export const metaConnectionReject = () => (dispatch, getState) => {
  const userName = getState().account.name;
  const { peer } = getState().metaConnection;
  const response = { name: userName, approved: false, rejected: true };
  dispatch(p2pRoomSendMessage(peer, response));
  dispatch(metaConnectionHide());
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  peer: "",
  request: false,
  name: "",
  socialMedia: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case METACONNECTION_SHOW:
      return {
        ...state,
        peer: action.payload.peer,
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
