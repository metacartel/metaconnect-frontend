import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Base from "../layouts/base";
import Card from "../components/Card";
import Icon from "../components/Icon";
import Column from "../components/Column";
import SocialMediaList from "../components/SocialMediaList";
import QRCodeScanner from "../components/QRCodeScanner";
import QRCodeDisplay from "../components/QRCodeDisplay";
import camera from "../assets/camera.svg";
import qrcode from "../assets/qrcode.svg";
import { responsive } from "../styles";
import { notificationShow } from "../reducers/_notification";
import { metaConnectionShow } from "../reducers/_metaConnection";
import { formatHandle, parseQueryParams } from "../helpers/utilities";
import { colors, transitions } from "../styles";

const StyledWrapper = styled(Column)`
  padding: 20px;
  height: 100%;
  min-height: 100vh;
  @media screen and (${responsive.sm.max}) {
    padding: 20px 0;
    padding-top: 50px;
  }
`;

const StyledQRCodeWrapper = styled.div`
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

const StyledProfile = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const StyledName = styled.h3`
  & span {
    margin-right: 12px;
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
    ? "http://localhost:3000"
    : "https://metaconnect.me";

class Dashboard extends Component {
  state = {
    scan: false,
    uri: ""
  };

  componentDidMount() {
    this.updateURI();
  }

  updateURI = () => {
    this.setState({ uri: "" });
    const name = this.props.name;
    const socialMedia = encodeURIComponent(
      JSON.stringify(this.props.socialMedia)
    );
    let uri = `${baseUrl}?name=${name}&socialMedia=${socialMedia}&t=${Date.now()}`;
    this.setState({ uri });
  };

  openMetaConnection(metaConnection) {
    this.props.metaConnectionShow(metaConnection);
    window.browserHistory.push("/meta-connection");
  }

  toggleQRCodeScanner = () => this.setState({ scan: !this.state.scan });

  onQRCodeError = () => {
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
    const pathEnd =
      string.indexOf("?") !== -1 ? string.indexOf("?") : undefined;
    const queryString = pathEnd ? string.substring(pathEnd) : "";
    let queryParams = parseQueryParams(queryString);
    if (Object.keys(queryParams).length) {
      const metaConnection = {
        request: true,
        name: queryParams.name,
        socialMedia: queryParams.socialMedia
          ? JSON.parse(queryParams.socialMedia)
          : {}
      };
      this.openMetaConnection(metaConnection);
    }
    this.toggleQRCodeScanner();
  };

  render() {
    const qrcodeScale =
      window.innerWidth < 470 ? (window.innerWidth < 370 ? 3 : 4) : 5;

    return (
      <Base>
        <StyledWrapper maxWidth={400}>
          <StyledProfile>
            <StyledName>
              <span>{`👩‍🚀`}</span>
              {`@${this.props.name}`}
            </StyledName>
            <SocialMediaList socialMedia={this.props.socialMedia} />
          </StyledProfile>
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
              ) : (
                <QRCodeDisplay scale={qrcodeScale} data={this.state.uri} />
              )}
            </StyledQRCodeWrapper>
          </Card>
          <StyledMetaConnectionsListWrapper>
            <h2>Your MetaConnections</h2>
            {Object.keys(this.props.metaConnections).length ? (
              <StyledMetaConnectionsList>
                {Object.keys(this.props.metaConnections).map(key => (
                  <StyledMetaConnectionsItem
                    onClick={() => {
                      const metaConnection = {
                        request: false,
                        name: this.props.metaConnections[key].name,
                        socialMedia: this.props.metaConnections[key].socialMedia
                      };
                      this.openMetaConnection(metaConnection);
                    }}
                  >
                    {formatHandle(key)}
                  </StyledMetaConnectionsItem>
                ))}
              </StyledMetaConnectionsList>
            ) : (
              <StyledMetaConnectionsItem>
                {"Go make some MetaConnections"}
              </StyledMetaConnectionsItem>
            )}
          </StyledMetaConnectionsListWrapper>
        </StyledWrapper>
      </Base>
    );
  }
}

const reduxProps = ({ account }) => ({
  name: account.name,
  socialMedia: account.socialMedia,
  metaConnections: account.metaConnections
});

export default connect(
  reduxProps,
  { metaConnectionShow, notificationShow }
)(Dashboard);
