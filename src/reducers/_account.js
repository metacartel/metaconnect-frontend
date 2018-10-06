import { web3SetHttpProvider } from "../helpers/web3";

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_UPDATE_ADDRESS = "account/ACCOUNT_UPDATE_ADDRESS";

const ACCOUNT_UPDATE_NAME = "account/ACCOUNT_UPDATE_NAME";

const ACCOUNT_UPDATE_NETWORK = "account/ACCOUNT_UPDATE_NETWORK";

const ACCOUNT_UPDATE_PROVIDER = "account/ACCOUNT_UPDATE_PROVIDER";

const ACCOUNT_UPDATE_WEB3 = "account/ACCOUNT_UPDATE_WEB3";

const ACCOUNT_CLEAR_STATE = "account/ACCOUNT_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const accountUpdateNetwork = network => dispatch => {
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: ACCOUNT_UPDATE_NETWORK, payload: network });
};

export const accountUpdateWeb3 = web3 => dispatch => {
  dispatch({ type: ACCOUNT_UPDATE_WEB3, payload: web3 });
};

export const accountUpdateAddress = address => (dispatch, getState) => {
  if (!address) return;
  dispatch({
    type: ACCOUNT_UPDATE_ADDRESS,
    payload: address
  });
};

export const accountUpdateName = name => (dispatch, getState) => {
  if (!name) return;
  dispatch({
    type: ACCOUNT_UPDATE_NAME,
    payload: name
  });
};

export const accountClearState = () => dispatch => {
  dispatch({ type: ACCOUNT_CLEAR_STATE });
};

export // -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  network: "mainnet",
  provider: null,
  web3: null,
  address: "",
  name: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE_ADDRESS:
      return { ...state, address: action.payload };
    case ACCOUNT_UPDATE_NAME:
      return { ...state, name: action.payload };
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
