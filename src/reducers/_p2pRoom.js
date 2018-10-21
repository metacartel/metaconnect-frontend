import Room from "ipfs-pubsub-room";
import IPFS from "ipfs";

// -- Constants ------------------------------------------------------------- //
const P2PROOM_INIT_REQUEST = "p2pRoom/P2PROOM_INIT_REQUEST";
const P2PROOM_INIT_SUCCESS = "p2pRoom/P2PROOM_INIT_SUCCESS";
const P2PROOM_INIT_FAILURE = "p2pRoom/P2PROOM_INIT_FAILURE";

const P2PROOM_OPEN_ROOM = "p2pRoom/P2PROOM_OPEN_ROOM";

const P2PROOM_PEER_JOINED = "p2pRoom/P2PROOM_PEER_JOINED";

const P2PROOM_PEER_LEFT = "p2pRoom/P2PROOM_PEER_LEFT";

const P2PROOM_UPDATE_LOGS = "p2pRoom/P2PROOM_UPDATE_LOGS";

const P2PROOM_DISCONNECTED = "p2pRoom/P2PROOM_DISCONNECTED";

// -- Actions --------------------------------------------------------------- //

const p2pRoomUpdateLogs = log => (dispatch, getState) => {
  const { logs } = getState().p2pRoom;
  const payload = [...logs, log];
  dispatch({ type: P2PROOM_UPDATE_LOGS, payload });
};

const p2pRoomAddPeer = peer => (dispatch, getState) => {
  const { activePeers } = getState().p2pRoom;
  const payload = [...activePeers, peer];
  dispatch({ type: P2PROOM_PEER_JOINED, payload });
};

const p2pRoomRemovePeer = peer => (dispatch, getState) => {
  const { activePeers } = getState().p2pRoom;
  const payload = activePeers.filter(x => x !== peer);
  dispatch({ type: P2PROOM_PEER_LEFT, payload });
};

export const p2pRoomInit = () => async (dispatch, getState) => {
  dispatch({ type: P2PROOM_INIT_REQUEST });

  let ipfs = new IPFS({
    EXPERIMENTAL: {
      pubsub: true
    },
    repo: "metaconnect-p2proom",
    config: {
      Addresses: {
        Swarm: [
          "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
        ]
      }
    }
  });

  const { roomName, devMonitor } = getState().p2pRoom;

  ipfs.on("ready", () => {
    if (devMonitor) dispatch(p2pRoomUpdateLogs("Connected!"));

    ipfs.id((err, info) => {
      if (err) {
        throw err;
      }
      const userId = info.id;
      if (devMonitor) dispatch(p2pRoomUpdateLogs(`Connected as ${userId}`));
      dispatch({
        type: P2PROOM_INIT_SUCCESS,
        payload: { ipfs, userId }
      });
    });

    const room = Room(ipfs, roomName);

    dispatch({ type: P2PROOM_OPEN_ROOM, payload: room });

    dispatch(p2pRoomRegisterListeners());
  });

  ipfs.on("stop", () => {
    if (devMonitor) dispatch(p2pRoomUpdateLogs("Disconnected!"));
    dispatch({ type: P2PROOM_DISCONNECTED });
  });
};

const defaultListeners = [
  { event: "peer joined", callback: () => {} },
  { event: "peer left", callback: () => {} },
  { event: "subscribed", callback: () => {} },
  { event: "message", callback: () => {} }
];

export const p2pRoomRegisterListeners = (listeners = defaultListeners) => (
  dispatch,
  getState
) => {
  const { room, roomName, devMonitor } = getState().p2pRoom;

  listeners.forEach(({ event, callback }) => {
    switch (event) {
      case "peer joined":
        console.log('REGISTER: "peer joined" event listeners', callback);
        room.on("peer joined", peer => {
          if (devMonitor) dispatch(p2pRoomUpdateLogs(`Joined: ${peer}`));
          dispatch(p2pRoomAddPeer(peer));
          callback(peer);
        });
        break;
      case "peer left":
        console.log('REGISTER: "peer left" event listeners', callback);
        room.on("peer left", peer => {
          if (devMonitor) dispatch(p2pRoomUpdateLogs(`Left: ${peer}`));
          dispatch(p2pRoomRemovePeer(peer));
          callback(peer);
        });
        break;
      case "subscribed":
        console.log('REGISTER: "subscribed" event listeners', callback);
        room.on("subscribed", () => {
          if (devMonitor)
            dispatch(p2pRoomUpdateLogs(`Room Subscribed: "${roomName}"`));
          callback();
        });
        break;
      case "message":
        console.log('REGISTER: "message" event listeners', callback);
        room.on("message", message => {
          if (devMonitor)
            dispatch(p2pRoomUpdateLogs(`Message: ${message.data.toString()}`));
          callback(message);
        });
        break;

      default:
        break;
    }
  });
  return true;
};

export const p2pRoomSendMessage = (peer, message) => (dispatch, getState) => {
  const { connected, room } = getState().p2pRoom;
  if (!connected || !room) {
    throw new Error("IPFS Network not connected or P2P Room not available");
  }
  room.sendTo(peer, message);
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  roomName: "metaconnect-p2proom",
  devMonitor: process.env.NODE_ENV === "development",
  ipfs: null,
  room: null,
  loading: false,
  connected: false,
  userId: "",
  activePeers: [],
  logs: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case P2PROOM_INIT_REQUEST:
      return {
        ...state,
        loading: true
      };

    case P2PROOM_INIT_SUCCESS:
      return {
        ...state,
        loading: false,
        connected: true,
        ipfs: action.payload.ipfs,
        userId: action.payload.userId
      };
    case P2PROOM_INIT_FAILURE:
      return {
        ...state,
        loading: false,
        userId: ""
      };
    case P2PROOM_OPEN_ROOM:
      return {
        ...state,
        room: action.payload
      };
    case P2PROOM_PEER_JOINED:
    case P2PROOM_PEER_LEFT:
      return {
        ...state,
        activePeers: action.payload
      };
    case P2PROOM_UPDATE_LOGS:
      return {
        ...state,
        logs: action.payload
      };
    case P2PROOM_DISCONNECTED:
      return {
        ...state,
        loading: false,
        connected: false,
        userId: "",
        activePeers: []
      };
    default:
      return state;
  }
};
