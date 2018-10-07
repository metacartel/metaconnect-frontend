import { web3SetHttpProvider } from "../helpers/web3";
import { updateLocal, getLocal } from "../helpers/localstorage";

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_UPDATE_ADDRESS = "account/ACCOUNT_UPDATE_ADDRESS";

const ACCOUNT_UPDATE_NAME = "account/ACCOUNT_UPDATE_NAME";

const ACCOUNT_UPDATE_SOCIAL_MEDIA = "account/ACCOUNT_UPDATE_SOCIAL_MEDIA";

const ACCOUNT_UPDATE_METACONNECTIONS = "account/ACCOUNT_UPDATE_METACONNECTIONS";

const ACCOUNT_UPDATE_NETWORK = "account/ACCOUNT_UPDATE_NETWORK";

const ACCOUNT_UPDATE_PROVIDER = "account/ACCOUNT_UPDATE_PROVIDER";

const ACCOUNT_UPDATE_WEB3 = "account/ACCOUNT_UPDATE_WEB3";

const ACCOUNT_CLEAR_STATE = "account/ACCOUNT_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

const localStorageKey = "METACONNECT_ACCOUNT";

export const accountUpdateAddress = _address => (dispatch, getState) => {
  if (!_address) return;
  const { address, name, socialMedia, metaConnections } = getState().account;
  const accountData = { address, name, socialMedia, metaConnections };
  const newAccountData = { ...accountData, address: _address };
  updateLocal(localStorageKey, newAccountData);
  dispatch({
    type: ACCOUNT_UPDATE_ADDRESS,
    payload: _address
  });
};

export const accountUpdateName = _name => (dispatch, getState) => {
  if (!_name) return;
  const { address, name, socialMedia, metaConnections } = getState().account;
  const accountData = { address, name, socialMedia, metaConnections };
  const newAccountData = { ...accountData, name: _name };
  updateLocal(localStorageKey, newAccountData);
  dispatch({
    type: ACCOUNT_UPDATE_NAME,
    payload: _name
  });
};

export const accountUpdateSocialMedia = _socialMedia => (
  dispatch,
  getState
) => {
  if (!_socialMedia) return;
  const { address, name, socialMedia, metaConnections } = getState().account;
  const accountData = { address, name, socialMedia, metaConnections };
  const newAccountData = { ...accountData, socialMedia: _socialMedia };
  updateLocal(localStorageKey, newAccountData);
  dispatch({
    type: ACCOUNT_UPDATE_SOCIAL_MEDIA,
    payload: _socialMedia
  });
};

export const accountUpdateMetaConnections = _metaConnections => (
  dispatch,
  getState
) => {
  if (!_metaConnections) return;
  const { address, name, socialMedia, metaConnections } = getState().account;
  const accountData = { address, name, socialMedia, metaConnections };
  const newAccountData = { ...accountData, metaConnections: _metaConnections };
  updateLocal(localStorageKey, newAccountData);
  dispatch({
    type: ACCOUNT_UPDATE_METACONNECTIONS,
    payload: _metaConnections
  });
};

export const accountUpdateNetwork = network => dispatch => {
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: ACCOUNT_UPDATE_NETWORK, payload: network });
};

export const accountUpdateWeb3 = web3 => dispatch => {
  dispatch({
    type: ACCOUNT_UPDATE_WEB3,
    payload: web3
  });
};

export const accountClearState = () => ({ type: ACCOUNT_CLEAR_STATE });

export // -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  network: "mainnet",
  provider: null,
  web3: null,
  address: getLocal(localStorageKey).address || "",
  name: getLocal(localStorageKey).name || "",
  metaConnections: getLocal("METACONNECTIONS") || {},
  socialMedia: getLocal(localStorageKey).socialMedia || {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE_ADDRESS:
      return { ...state, address: action.payload };
    case ACCOUNT_UPDATE_NAME:
      return { ...state, name: action.payload };
    case ACCOUNT_UPDATE_SOCIAL_MEDIA:
      return { ...state, socialMedia: action.payload };
    case ACCOUNT_UPDATE_METACONNECTIONS:
      return { ...state, metaConnections: action.payload };
    case ACCOUNT_UPDATE_NETWORK:
      return { ...state, network: action.payload };
    case ACCOUNT_UPDATE_PROVIDER:
      return { ...state, provider: action.payload };
    case ACCOUNT_UPDATE_WEB3:
      return { ...state, web3: action.payload };
    case ACCOUNT_CLEAR_STATE:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
