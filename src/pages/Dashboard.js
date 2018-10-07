import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Base from "../layouts/base";
import Link from "../components/Link";
import Card from "../components/Card";
import Column from "../components/Column";
import QRCodeDisplay from "../components/QRCodeDisplay";
import camera from "../assets/camera.svg";
import twitter from "../assets/twitter.svg";
import telegram from "../assets/telegram.svg";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";
import { responsive } from "../styles";
import { formatHandle, parseQueryParams } from "../helpers/utilities";

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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCameraButton = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${camera});
  background-size: contain;
  background-repeat: no-repeat;
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

const StyledSocialMediaWrapper = styled.div`
  margin: 8px 0;
`;

const StyledSocialMedia = styled.div`
  display: flex;
  & a > * {
    margin-left: 10px !important;
  }
  & a:first-child > div {
    margin-left: 0 !important;
  }
`;

const StyledSocialMediaIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: ${({ icon }) => `url(${icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const StyledMetaConnectionsListWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const StyledMetaConnectionsList = styled.div``;

const StyledMetaConnectionsItem = styled.div`
  margin: 10px auto;
  text-align: left;
`;

let intervalId = null;

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
    this.startInterval();
  }
  startInterval = () => {
    const self = this;
    intervalId = setInterval(self.updateURI, 5000);
  };
  updateURI = () => {
    this.setState({ uri: "" });
    const name = this.props.name;
    const socialMedia = encodeURIComponent(
      JSON.stringify(this.props.socialMedia)
    );
    let uri = `${baseUrl}?name=${name}&socialMedia=${socialMedia}&t=${Date.now()}`;
    this.setState({ uri });
    console.log(this.state.uri);
  };
  stopInterval = () => clearInterval(intervalId);
  componetWillUnmount() {
    this.clearInterval();
  }
  toggleScanner = () => this.setState({ scan: !this.state.scan });

  onScan = string => {
    const pathEnd =
      string.indexOf("?") !== -1 ? string.indexOf("?") : undefined;
    const queryString = pathEnd ? string.substring(pathEnd) : "";
    let queryParams = parseQueryParams(queryString);
    if (Object.keys(queryParams).length) {
      this.props.metaConnectionShow({
        request: true,
        name: queryParams.name,
        socialMedia: queryParams.social ? JSON.parse(queryParams.social) : {}
      });
      window.browserHistory.push("/meta-connection");
    }
    this.toggleScanner();
  };

  render() {
    const { name, socialMedia } = this.props;
    const qrcodeScale =
      window.innerWidth < 470 ? (window.innerWidth < 370 ? 3 : 4) : 5;

    return (
      <Base
        scan={this.state.scan}
        toggleScanner={this.toggleScanner}
        onScan={this.onScan}
      >
        <StyledWrapper maxWidth={400}>
          <StyledProfile>
            <StyledName>
              <span>{`👩‍🚀`}</span>
              {`@${name}`}
            </StyledName>
            <StyledSocialMediaWrapper>
              {!Object.keys(socialMedia).length ? (
                <Link to="/edit-social-media">{"Add Social Media"}</Link>
              ) : (
                <StyledSocialMedia>
                  {!!socialMedia.twitter && (
                    <a href={`https://twitter.com/${socialMedia.twitter}`}>
                      <StyledSocialMediaIcon icon={twitter} />
                    </a>
                  )}
                  {!!socialMedia.telegram && (
                    <a href={`https://t.me/${socialMedia.telegram}`}>
                      <StyledSocialMediaIcon icon={telegram} />
                    </a>
                  )}
                  {!!socialMedia.github && (
                    <a href={`https://github.com/${socialMedia.github}`}>
                      <StyledSocialMediaIcon icon={github} />
                    </a>
                  )}

                  {!!socialMedia.linkedin && (
                    <a href={`https://linkedin.com/in/${socialMedia.linkedin}`}>
                      <StyledSocialMediaIcon icon={linkedin} />
                    </a>
                  )}
                  {!!socialMedia.email && (
                    <a href={`mailto:${socialMedia.email}`}>
                      <StyledSocialMediaIcon icon={email} />
                    </a>
                  )}
                  {!!socialMedia.phone && (
                    <a href={`tel:${socialMedia.phone}`}>
                      <StyledSocialMediaIcon icon={phone} />
                    </a>
                  )}
                  <Link to="/edit-social-media">
                    <span>{"edit"}</span>
                  </Link>
                </StyledSocialMedia>
              )}
            </StyledSocialMediaWrapper>
          </StyledProfile>
          <StyledContainer>
            <StyledMetaConnections>
              {Object.keys(this.props.metaConnections).length || 0}
              <span>{` ❤️`}</span>
            </StyledMetaConnections>
            <StyledCameraButton onClick={this.toggleScanner} />
          </StyledContainer>
          <StyledContainer>
            <StyledParagrah>{`Scan to get more ❤️`}</StyledParagrah>
          </StyledContainer>
          <Card>
            {this.state.uri && (
              <StyledQRCodeWrapper>
                <QRCodeDisplay scale={qrcodeScale} data={this.state.uri} />
              </StyledQRCodeWrapper>
            )}
          </Card>
          <StyledMetaConnectionsListWrapper>
            <h2>Your MetaConnections</h2>
            {Object.keys(this.props.metaConnections).length ? (
              <StyledMetaConnectionsList>
                {Object.keys(this.props.metaConnections).map(key => (
                  <StyledMetaConnectionsItem>
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
  null
)(Dashboard);
