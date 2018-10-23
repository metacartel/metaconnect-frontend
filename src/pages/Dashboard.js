import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import Base from "../layouts/base";
import Card from "../components/Card";
import Icon from "../components/Icon";
import Column from "../components/Column";
import QRCodeScanner from "../components/QRCodeScanner";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Loader from "../components/Loader";
import camera from "../assets/camera.svg";
import qrcode from "../assets/qrcode.svg";
import { notificationShow } from "../reducers/_notification";
import { metaConnectionShow } from "../reducers/_metaConnection";
import {
  p2pRoomSendMessage,
  p2pRoomRegisterListeners
} from "../reducers/_p2pRoom";
import {
  formatHandle,
  handleMetaConnectionURI,
  generateNewMetaConnection
} from "../helpers/utilities";
import { colors, transitions } from "../styles";

const StyledQRCodeWrapper = styled(Column)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 360px;
`;

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px auto;
`;

const StyledParagrah = styled.p`
  font-size: 20px;
  margin: 16px 0;
`;

const StyledMetaConnections = styled.div`
  display: flex;
  font-size: 52px;
  & span {
    font-size: 42px;
    line-height: 66px;
    margin: 0 8px;
  }
`;

const StyledMetaConnectionsListWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const StyledMetaConnectionsList = styled.div``;

const StyledMetaConnectionsItem = styled.div`
  margin: 10px auto;
  text-align: left;
  cursor: pointer;
  padding: 0 8px;
`;

const StyledMetaConnectionsEmpty = styled(StyledMetaConnectionsItem)`
  cursor: none;
`;

const StyledTabsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled(Icon)``;

const StyledTab = styled.div`
  transition: ${transitions.base};
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  margin: 4px;
  border-radius: 20px;
  border: ${({ active }) =>
    active
      ? `1px solid rgb(${colors.dark})`
      : `1px solid rgb(${colors.darkGrey})`};

  & ${StyledIcon} {
    background-color: ${({ active }) =>
      active ? `rgb(${colors.dark})` : `rgb(${colors.darkGrey})`};
  }

  & p {
    color: ${({ active }) =>
      active ? `rgb(${colors.dark})` : `rgb(${colors.darkGrey})`};
  }

  &:hover {
    border: 1px solid rgba(${colors.dark}, 0.7);

    & ${StyledIcon} {
      background-color: rgba(${colors.dark}, 0.7);
    }

    & p {
      color: rgba(${colors.dark}, 0.7);
    }
  }
`;

let baseUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://" + window.location.host
    : "https://metaconnect.me";

class Dashboard extends Component {
  state = {
    scan: false
  };

  componentDidUpdate() {
    if (!this.props.loading && this.props.connected) {
      const listeners = [
        {
          event: "message",
          callback: this.onMessage
        }
      ];
      this.props.p2pRoomRegisterListeners(listeners);
    }
  }

  sendMessage = (peer, message) => {
    this.props.p2pRoomSendMessage(peer, message);
  };

  onMessage = message => {
    let msgString = message.data.toString();
    if (msgString.trim()) {
      let result = null;
      try {
        result = JSON.parse(msgString);
      } catch (err) {
        throw new Error(err);
      }
      if (result) {
        if (result.request) {
          this.openNewMetaConnection(result);
        } else if (result.approved) {
          this.props.notificationShow(
            `${formatHandle(result.name)} has approved your MetaConnection!`
          );
        } else if (result.rejected) {
          this.props.notificationShow(
            `${formatHandle(result.name)} has rejected your MetaConnection!`,
            true
          );
        }
      }
    }
  };

  openNewMetaConnection = metaConnection =>
    this.props.metaConnectionShow(metaConnection);

  openExistingMetaConnection = metaConnection => {
    this.props.metaConnectionShow({
      peer: null,
      request: false,
      name: metaConnection.name,
      socialMedia: metaConnection.socialMedia
    });
  };

  sendMetaConnection(peer) {
    const metaConnection = generateNewMetaConnection({
      peer: this.props.userId,
      name: this.props.name,
      socialMedia: this.props.socialMedia
    });
    this.sendMessage(peer, metaConnection);
  }

  generateQRCodeURI = () => {
    const { userId } = this.props;
    const name = encodeURIComponent(this.props.name);
    const socialMedia = encodeURIComponent(
      JSON.stringify(this.props.socialMedia)
    );
    let uri = "";
    if (userId) {
      uri = `${baseUrl}?id=${userId}&name=${name}&socialMedia=${socialMedia}`;
    }

    return uri;
  };

  toggleQRCodeScanner = () => this.setState({ scan: !this.state.scan });

  onQRCodeError = err => {
    console.error(err);
    this.props.notificationShow("Something went wrong!", true);
  };

  onQRCodeValidate = data => {
    let result = null;
    if (data.startsWith("http:") || data.startsWith("https:")) {
      result = data;
    }
    return { data, result, onError: this.onQRCodeError };
  };

  onQRCodeScan = string => {
    const result = handleMetaConnectionURI(string);
    if (result) {
      this.toggleQRCodeScanner();
      this.sendMetaConnection(result.peer);
      this.openNewMetaConnection(result);
    }
  };

  render() {
    return (
      <Base showSocialMedia>
        <StyledContainer>
          <StyledMetaConnections>
            {Object.keys(this.props.metaConnections).length || 0}
            <span>{` ❤️`}</span>
          </StyledMetaConnections>
          <StyledParagrah>{`Scan to get more ❤️`}</StyledParagrah>
        </StyledContainer>
        <Card>
          <StyledTabsWrapper>
            <StyledTab
              active={!this.state.scan}
              onClick={this.toggleQRCodeScanner}
            >
              <StyledIcon
                icon={qrcode}
                size={20}
                color={"dark"}
                onClick={this.toggleQRCodeScanner}
              />
              <p>QR Code</p>
            </StyledTab>
            <StyledTab
              active={this.state.scan}
              onClick={this.toggleQRCodeScanner}
            >
              <StyledIcon
                icon={camera}
                size={20}
                color={"dark"}
                onClick={this.toggleQRCodeScanner}
              />
              <p>Scan</p>
            </StyledTab>
          </StyledTabsWrapper>
          <StyledQRCodeWrapper>
            {this.state.scan ? (
              <QRCodeScanner
                onValidate={this.onQRCodeValidate}
                onError={this.onQRCodeError}
                onScan={this.onQRCodeScan}
                onClose={this.toggleQRCodeScanner}
              />
            ) : !this.props.loading ? (
              <QRCodeDisplay data={this.generateQRCodeURI()} />
            ) : (
              <Loader color="dark" background="white" />
            )}
          </StyledQRCodeWrapper>
        </Card>
        <StyledMetaConnectionsListWrapper>
          <h2>Your MetaConnections</h2>
          {Object.keys(this.props.metaConnections).length ? (
            <StyledMetaConnectionsList>
              {Object.keys(this.props.metaConnections).map(key => (
                <StyledMetaConnectionsItem
                  key={key}
                  onClick={() =>
                    this.openExistingMetaConnection(
                      this.props.metaConnections[key]
                    )
                  }
                >
                  {formatHandle(key)}
                </StyledMetaConnectionsItem>
              ))}
            </StyledMetaConnectionsList>
          ) : (
            <StyledMetaConnectionsEmpty>
              {"Go make some MetaConnections"}
            </StyledMetaConnectionsEmpty>
          )}
        </StyledMetaConnectionsListWrapper>
      </Base>
    );
  }
}

Dashboard.propTypes = {
  metaConnectionShow: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  p2pRoomSendMessage: PropTypes.func.isRequired,
  p2pRoomRegisterListeners: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  socialMedia: PropTypes.object.isRequired,
  metaConnections: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired
};

const reduxProps = ({ account, p2pRoom }) => ({
  name: account.name,
  socialMedia: account.socialMedia,
  metaConnections: account.metaConnections,
  loading: p2pRoom.loading,
  connected: p2pRoom.connected,
  userId: p2pRoom.userId
});

export default connect(
  reduxProps,
  {
    metaConnectionShow,
    notificationShow,
    p2pRoomSendMessage,
    p2pRoomRegisterListeners
  }
)(Dashboard);
