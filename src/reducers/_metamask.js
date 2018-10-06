import {
  accountUpdateAddress,
  accountUpdateNetwork,
  accountUpdateWeb3
} from "./_account";
import { notificationShow } from "./_notification";

// -- Constants ------------------------------------------------------------- //
const METAMASK_CONNECT_REQUEST = "metamask/METAMASK_CONNECT_REQUEST";
const METAMASK_CONNECT_SUCCESS = "metamask/METAMASK_CONNECT_SUCCESS";
const METAMASK_CONNECT_FAILURE = "metamask/METAMASK_CONNECT_FAILURE";

const METAMASK_NOT_AVAILABLE = "metamask/METAMASK_NOT_AVAILABLE";

const METAMASK_UPDATE_METAMASK_ACCOUNT =
  "metamask/METAMASK_UPDATE_METAMASK_ACCOUNT";

// -- Actions --------------------------------------------------------------- //

let accountInterval = null;

const networks = {
  mainnet: {
    id: 1,
    value: "Mainnet"
  },
  ropsten: {
    id: 3,
    value: "Ropsten"
  },
  rinkeby: {
    id: 4,
    value: "Rinkeby"
  },
  kovan: {
    id: 42,
    value: "Kovan"
  }
};

const getMetamaskNetwork = () =>
  new Promise((resolve, reject) => {
    if (typeof window.web3 !== "undefined") {
      window.web3.version.getNetwork((err, networkID) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        let networkIDList = {};
        Object.keys(networks).forEach(network => {
          networkIDList[networks[network].id] = network;
        });
        resolve(networkIDList[Number(networkID)] || null);
      });
    }
  });

export const updateAccountAddress = address => dispatch => {
  if (address) {
    dispatch(accountUpdateAddress(address, "METAMASK"));
    window.browserHistory.push("/dashboard");
  }
};

export const metamaskUpdateMetamaskAccount = () => (dispatch, getState) => {
  if (window.web3.eth.defaultAccount !== getState().metamask.address) {
    const address = window.web3.eth.defaultAccount;
    dispatch({
      type: METAMASK_UPDATE_METAMASK_ACCOUNT,
      payload: address
    });
    dispatch(updateAccountAddress(address));
  }
};

export const metamaskConnectInit = () => (dispatch, getState) => {
  const address =
    getState().metamask.address || typeof window.web3 !== "undefined"
      ? window.web3.eth.defaultAccount
      : "";
  if (typeof window.web3 !== "undefined") {
    if (!address) {
      dispatch(notificationShow("Unlock your Metamask", false));
    }
    dispatch(updateAccountAddress(address));
    dispatch({ type: METAMASK_CONNECT_REQUEST });
    getMetamaskNetwork()
      .then(network => {
        dispatch({ type: METAMASK_CONNECT_SUCCESS, payload: network });
        dispatch(accountUpdateNetwork(network));
        dispatch(accountUpdateWeb3(window.web3));
        dispatch(metamaskUpdateMetamaskAccount());
        accountInterval = setInterval(
          () => dispatch(metamaskUpdateMetamaskAccount()),
          100
        );
      })
      .catch(error => {
        const message = "Something went wrong";
        dispatch(notificationShow(message, true));
        dispatch({ type: METAMASK_CONNECT_FAILURE });
      });
  } else {
    dispatch(notificationShow("Install Metamask first", false));
    dispatch({ type: METAMASK_NOT_AVAILABLE });
  }
};

export const metamaskClearIntervals = () => dispatch => {
  clearInterval(accountInterval);
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  fetching: false,
  address: "",
  web3Available: false,
  network: "mainnet"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case METAMASK_CONNECT_REQUEST:
      return {
        ...state,
        fetching: true,
        web3Available: false
      };
    case METAMASK_CONNECT_SUCCESS:
      return {
        ...state,
        fetching: false,
        web3Available: true,
        network: action.payload
      };
    case METAMASK_CONNECT_FAILURE:
      return {
        ...state,
        fetching: false,
        web3Available: true
      };
    case METAMASK_NOT_AVAILABLE:
      return {
        ...state,
        fetching: false,
        web3Available: false
      };
    case METAMASK_UPDATE_METAMASK_ACCOUNT:
      return {
        ...state,
        address: action.payload
      };
    default:
      return state;
  }
};
