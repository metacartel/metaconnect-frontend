import React, { Component } from "react";
import styled from "styled-components";

const METACONNECTROOMNAME = "metaconnect";
const SHOWLOWLEVELNETWORK = true;

let Room;
let IPFS;
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
} catch (e) {
  console.log(e);
}

const StyledP2PItem = styled.div`
  margin: 10px auto;
  text-align: left;
`;

class P2PNetwork extends Component {
  state = {
    networkChatter: [],
    announcedHello: false
  };
  addNetworkChatter(item) {
    this.state.networkChatter.push(item);
    this.setState({ networkChatter: this.state.networkChatter });
  }
  componentDidMount() {
    this.addNetworkChatter("connecting...");
    // IPFS node is ready, so we can start using ipfs-pubsub-room
    ipfs.on("ready", () => {
      this.addNetworkChatter("connected!");
      const room = Room(ipfs, METACONNECTROOMNAME);

      ipfs.id((err, info) => {
        if (err) {
          throw err;
        }
        if (SHOWLOWLEVELNETWORK)
          this.addNetworkChatter("connected as " + info.id);
      });

      room.on("peer joined", peer => {
        if (SHOWLOWLEVELNETWORK) this.addNetworkChatter("joined:" + peer);
        room.sendTo(peer, "@" + this.props.name + " says hello to you.");
        if (!this.state.announcedHello) {
          this.setState({ announcedHello: true });
          room.broadcast("@" + this.props.name + " is in da house!");
        }
      });

      room.on("peer left", peer => {
        if (SHOWLOWLEVELNETWORK) this.addNetworkChatter("left:" + peer);
      });

      room.on("subscribed", () => {
        if (SHOWLOWLEVELNETWORK) this.addNetworkChatter("subscribed!");
      });

      room.on("message", message => {
        this.addNetworkChatter(message.data.toString());
      });
    });
  }
  render() {
    console.log("this.state.networkChatter", this.state.networkChatter);
    let networkDisplay = "loading...";
    if (this.state.networkChatter) {
      networkDisplay = [];
      for (let i in this.state.networkChatter) {
        let item = this.state.networkChatter[i];
        networkDisplay.push(<div key={"networkChatter" + i}>{item}</div>);
      }
      //networkDisplay.reverse()
    }
    return <StyledP2PItem spanHeight>{networkDisplay}</StyledP2PItem>;
  }
}

P2PNetwork.propTypes = {};

export default P2PNetwork;
