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
    left: "0"
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

const IPFSPubSubRoomContext = React.createContext({});

class IPFSPubSubRoomComponent extends Component {
  state = {
    ipfs: null,
    room: null,
    ipfsId: null,
    ipfsConnected: false,
    logs: [],
    activePeers: []
  };

  componentDidMount() {
    this.registerIpfsRoom();
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
  };
  registerIpfsRoom = async () => {
    const { roomName, monitor } = this.props;

    await this.initIpfs();

    if (monitor) this.updateMonitorLogs("connected!");
    this.setState({ ipfsConnected: true });

    const { ipfs } = this.state;

    ipfs.on("ready", () => {
      ipfs.id((err, info) => {
        if (err) {
          throw err;
        }
        const ipfsId = info.id;
        if (monitor) this.updateMonitorLogs(`connected as ${ipfsId}`);
        this.registerNodeId(ipfsId);
      });

      const room = Room(ipfs, roomName);
      this.setState({ room });

      room.on("peer joined", peer => {
        if (monitor) this.updateMonitorLogs(`joined: ${peer}`);
        this.addPeer(peer);
      });

      room.on("peer left", peer => {
        if (monitor) this.updateMonitorLogs(`left: ${peer}`);
        this.removePeer(peer);
      });

      room.on("subscribed", () => {
        if (monitor) this.updateMonitorLogs("subscribed!");
      });

      room.on("message", message => {
        if (monitor) this.updateMonitorLogs(message.data.toString());
      });
    });

    ipfs.on("stop", () => {
      if (monitor) this.updateMonitorLogs("disconnected!");
      this.setState({ ipfsConnected: false });
    });
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

    let monitorLogs = logs || ["No monitor logs"];

    return monitorLogs.map((log, idx) => (
      <div className="ipfs-pubsub-log" style={styles.log} key={`logs-${idx}`}>
        {`> ${log}`}
      </div>
    ));
  };

  render() {
    return (
      <div>
        <div className="ipfs-pubsub-wrapper" style={styles.wrapper}>
          {this.props.monitor && (
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
        <IPFSPubSubRoomContext.Provider
          value={{
            ipfsConnected: this.state.ipfsConnected,
            ipfsId: this.state.ipfsId
          }}
        >
          {this.props.children}
        </IPFSPubSubRoomContext.Provider>
      </div>
    );
  }
}

IPFSPubSubRoomComponent.propTypes = {
  roomName: PropTypes.string.isRequired,
  monitor: PropTypes.bool
};

IPFSPubSubRoomComponent.defaultProps = {
  monitor: false
};

export default {
  Component: IPFSPubSubRoomComponent,
  Context: IPFSPubSubRoomContext
};
