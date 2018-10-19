import React, { Component } from "react";
import PropTypes from "prop-types";

let Room;
let IPFS;

const styles = {
  wrapper: {
    position: "fixed",
    top: "0",
    bottom: "0",
    right: "0",
    left: "0",
    zIndex: "10000000"
  },
  monitor: {
    background: "black",
    color: "white",
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "260px",
    wordBreak: "break-word",
    borderRadius: "6px",
    padding: "16px",
    fontSize: "12px",
    textAlign: "left"
  },
  title: {
    fontSize: "18px",
    textAlign: "center"
  },
  log: {
    padding: "10px 0"
  }
};

class IPFSPubSubRoom extends Component {
  state = {
    ipfs: null,
    room: null,
    ipfsId: null,
    ipfsConnected: false,
    logs: [],
    activePeers: []
  };

  componentDidMount() {
    this.initIpfs();
  }

  initIpfs = async () => {
    let ipfs;

    try {
      Room = require("ipfs-pubsub-room");
      IPFS = require("ipfs");
      ipfs = new IPFS({
        EXPERIMENTAL: {
          pubsub: true
        },
        repo: "metaconnect",
        config: {
          Addresses: {
            Swarm: [
              "/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"
            ]
          }
        }
      });
    } catch (err) {
      throw err;
    }

    this.setState({ ipfs });

    const { devMonitor } = this.props;

    ipfs.on("ready", () => {
      if (devMonitor) this.updateMonitorLogs("connected!");
      this.setState({ ipfsConnected: true });

      ipfs.id((err, info) => {
        if (err) {
          throw err;
        }
        const ipfsId = info.id;
        if (devMonitor) this.updateMonitorLogs(`connected as ${ipfsId}`);
        this.registerNodeId(ipfsId);
      });
    });
  };

  registerIpfsRoom = async ({
    onMessage = () => {},
    onSubcribed = () => {},
    onDisconnect = () => {},
    onPeerJoined = () => {},
    onPeerLeft = () => {}
  }) => {
    const { roomName, devMonitor } = this.props;

    console.log("[IPFSPubSubRoom] registerIpfsRoom this.props", this.props);

    const { ipfs } = this.state;
    const room = Room(ipfs, roomName);
    this.setState({ room });

    room.on("peer joined", peer => {
      if (devMonitor) this.updateMonitorLogs(`joined: ${peer}`);
      this.addPeer(peer);
      onPeerJoined(peer);
    });

    room.on("peer left", peer => {
      if (devMonitor) this.updateMonitorLogs(`left: ${peer}`);
      this.removePeer(peer);
      onPeerLeft(peer);
    });

    room.on("subscribed", () => {
      if (devMonitor) this.updateMonitorLogs("subscribed!");
      onSubcribed();
    });

    room.on("message", message => {
      if (devMonitor) this.updateMonitorLogs(message.data.toString());
      onMessage(message);
    });

    ipfs.on("stop", () => {
      if (devMonitor) this.updateMonitorLogs("disconnected!");
      this.setState({ ipfsConnected: false });
      onDisconnect();
    });
  };

  sendMessage = (peer, message) => {
    if (!this.state.ipfsConnected || !this.state.room) {
      throw new Error("IPFS Node not connected or PubSub Room not available");
    }
    this.state.room.sendTo(peer, message);
  };

  updateMonitorLogs = item => {
    console.log("logs update:", item);
    const logs = [...this.state.logs, item];
    this.setState({ logs });
  };

  registerNodeId = ipfsId => this.setState({ ipfsId });

  addPeer = peer => {
    const activePeers = [...this.state.activePeers, peer];
    this.setState({ activePeers });
  };

  onMessage = message => {
    console.log("message", message);
  };

  removePeer = peer => {
    const activePeers = this.state.activePeers.filter(x => x !== peer);
    this.setState({ activePeers });
  };

  renderMonitorLogs = () => {
    const { logs } = this.state;

    let devMonitorLogs = logs || ["No dev monitor logs"];

    return devMonitorLogs.map((log, idx) => (
      <div className="ipfs-pubsub-log" style={styles.log} key={`logs-${idx}`}>
        {`> ${log}`}
      </div>
    ));
  };

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(this.props.children, {
        ipfs: this.state.ipfs,
        room: this.state.room,
        ipfsConnected: this.state.ipfsConnected,
        ipfsId: this.state.ipfsId,
        sendMessage: this.sendMessage,
        registerIpfsRoom: this.registerIpfsRoom
      })
    );

    return (
      <div>
        <div className="ipfs-pubsub-wrapper" style={styles.wrapper}>
          {this.props.devMonitor && (
            <div className="ipfs-pubsub-monitor" style={styles.monitor}>
              <h1 className="ipfs-pubsub-title" style={styles.title}>
                IPFS PubSub Room
              </h1>
              {!this.state.ipfsConnected
                ? "connecting..."
                : this.renderMonitorLogs()}
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }
}

IPFSPubSubRoom.propTypes = {
  roomName: PropTypes.string.isRequired,
  onMessage: PropTypes.func,
  onSubcribed: PropTypes.func,
  onDisconnect: PropTypes.func,
  onPeerJoined: PropTypes.func,
  onPeerLeft: PropTypes.func,
  devMonitor: PropTypes.bool
};

IPFSPubSubRoom.defaultProps = {
  onMessage: () => {},
  onSubcribed: () => {},
  onDisconnect: () => {},
  onPeerJoined: () => {},
  onPeerLeft: () => {},
  devMonitor: false
};

export default IPFSPubSubRoom;
