import { web3SetHttpProvider } from "../helpers/web3";

// -- Constants ------------------------------------------------------------- //

const ACCOUNT_UPDATE_ADDRESS = "account/ACCOUNT_UPDATE_ADDRESS";

const ACCOUNT_UPDATE_NAME = "account/ACCOUNT_UPDATE_NAME";

const ACCOUNT_UPDATE_SOCIAL_MEDIA = "account/ACCOUNT_UPDATE_SOCIAL_MEDIA";

const ACCOUNT_UPDATE_NETWORK = "account/ACCOUNT_UPDATE_NETWORK";

const ACCOUNT_UPDATE_PROVIDER = "account/ACCOUNT_UPDATE_PROVIDER";

const ACCOUNT_UPDATE_WEB3 = "account/ACCOUNT_UPDATE_WEB3";

const ACCOUNT_CLEAR_STATE = "account/ACCOUNT_CLEAR_STATE";

// -- Actions --------------------------------------------------------------- //

export const accountUpdateNetwork = network => dispatch => {
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: ACCOUNT_UPDATE_NETWORK, payload: network });
};

export const accountUpdateWeb3 = web3 => ({
  type: ACCOUNT_UPDATE_WEB3,
  payload: web3
});

export const accountUpdateAddress = address => ({
  type: ACCOUNT_UPDATE_ADDRESS,
  payload: address
});

export const accountUpdateName = name => ({
  type: ACCOUNT_UPDATE_NAME,
  payload: name
});

export const accountUpdateSocialMedia = socialMedia => ({
  type: ACCOUNT_UPDATE_SOCIAL_MEDIA,
  payload: socialMedia
});

export const accountClearState = () => ({ type: ACCOUNT_CLEAR_STATE });

export // -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  network: "mainnet",
  provider: null,
  web3: null,
  address: "",
  name: "",
  socialMedia: {
    twitter: "",
    telegram: "",
    github: "",
    linkedin: "",
    phone: "",
    email: ""
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE_ADDRESS:
      return { ...state, address: action.payload };
    case ACCOUNT_UPDATE_NAME:
      return { ...state, name: action.payload };
    case ACCOUNT_UPDATE_SOCIAL_MEDIA:
      return { ...state, socialMedia: action.payload };
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
