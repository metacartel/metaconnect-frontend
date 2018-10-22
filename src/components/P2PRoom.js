import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { p2pRoomInit } from "../reducers/_p2pRoom";
import { colors } from "../styles";

const StyledMonitorWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000000;
`;

const StyledMonitorContainer = styled.div`
  background: rgb(${colors.dark});
  color: rgb(${colors.white});
  position: absolute;
  top: 10px;
  right: 10px;
  width: 260px;
  word-break: break-word;
  border-radius: 6px;
  padding: 16px;
  font-size: 12px;
  text-align: left;
`;

const StyledMonitorTitle = styled.div`
  font-size: 18px;
  text-align: center;
`;

const StyledMonitorLog = styled.div`
  padding: 10px 0;
`;

class P2PRoom extends Component {
  componentDidMount() {
    this.props.p2pRoomInit();
  }

  renderMonitorLogs = () => {
    const { logs } = this.props;

    let devMonitorLogs = logs || ["No dev monitor logs"];

    return devMonitorLogs.map((log, idx) => (
      <StyledMonitorLog key={`logs-${idx}`}>{`> ${log}`}</StyledMonitorLog>
    ));
  };

  render = () => (
    <div>
      <StyledMonitorWrapper>
        {this.props.devMonitor && (
          <StyledMonitorContainer>
            <StyledMonitorTitle>IPFS PubSub Room</StyledMonitorTitle>
            {this.props.loading
              ? "Connecting..."
              : this.props.connected
                ? this.renderMonitorLogs()
                : "Disconnected!"}
          </StyledMonitorContainer>
        )}
      </StyledMonitorWrapper>
      {this.props.children}
    </div>
  );
}

const reduxProps = ({ p2pRoom }) => ({
  devMonitor: p2pRoom.devMonitor,
  connected: p2pRoom.connected,
  loading: p2pRoom.loading,
  logs: p2pRoom.logs
});

export default connect(
  reduxProps,
  {
    p2pRoomInit
  }
)(P2PRoom);
