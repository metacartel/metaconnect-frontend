import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Base from "../layouts/base";
import Link from "../components/Link";
import Card from "../components/Card";
import Column from "../components/Column";
import AddButton from "../components/AddButton";
import QRCodeDisplay from "../components/QRCodeDisplay";
import camera from "../assets/camera.svg";

import twitter from "../assets/twitter.svg";
import telegram from "../assets/telegram.svg";
import linkedin from "../assets/linkedin.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";

const StyledWrapper = styled(Column)`
  padding: 20px;
  height: 100%;
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
  margin: 0 auto;
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

const StyledSocialMediaWrapper = styled.div`
  margin: 8px 0;
`;

const StyledSocialMedia = styled.div`
  display: flex;
`;

const StyledAddButton = styled(AddButton)`
  margin-left: 10px;
`;

const StyledSocialMediaIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  background-image: ${({ icon }) => `url(${icon})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

let intervalId = null;

let test =
  "https://metaconnect.me/?handle1=someguysname&sig1=0x9242685bf161793cc25603c231bc2f568eb630ea16aa137d2664ac80388256084f8ae3bd7535248d0bd448298cc2e2071e56992d0774dc340c368ae950852ada1c";

class Dashboard extends Component {
  state = {
    metaconnections: 0,
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
    const uri = `${test}&t=${Date.now()}`;
    console.log("uri", uri);
    this.setState({ uri });
  };
  stopInterval = () => clearInterval(intervalId);
  componetWillUnmount() {
    this.clearInterval();
  }
  toggleScanner = () => this.setState({ scan: !this.state.scan });

  onScan = data => {
    // TODO do something when QR code scans
    this.toggleScanner();
  };

  render() {
    const { name, socialMedia } = this.props;
    let noSocialMedia = false;
    Object.keys(socialMedia).forEach(key => {
      if (!noSocialMedia) {
        noSocialMedia = !socialMedia[key];
      }
    });

    return (
      <Base
        scan={this.state.scan}
        toggleScanner={this.toggleScanner}
        onScan={this.onScan}
      >
        <StyledWrapper maxWidth={400}>
          <StyledProfile>
            <h3>{`👩‍🚀 @${name}`}</h3>
            <StyledSocialMediaWrapper>
              {noSocialMedia ? (
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
                    <StyledAddButton size={20} />
                  </Link>
                </StyledSocialMedia>
              )}
            </StyledSocialMediaWrapper>
          </StyledProfile>
          <StyledContainer>
            <StyledMetaConnections>
              {this.state.metaconnections}
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
                <QRCodeDisplay scale={6} data={this.state.uri} />
              </StyledQRCodeWrapper>
            )}
          </Card>
        </StyledWrapper>
      </Base>
    );
  }
}

const reduxProps = ({ account }) => ({
  name: account.name,
  socialMedia: account.socialMedia
});

export default connect(
  reduxProps,
  null
)(Dashboard);
