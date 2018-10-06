import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Button from "../components/Button";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Base from "../layouts/base";

const StyledTitle = styled.h3`
  margin-bottom: 50px;
`;

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  text-align: center;
  height: 100%;
`;

const StyledQRCodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

let intervalId = null;

let test =
  "https://metaconnect.me/?handle1=someguysname&sig1=0x9242685bf161793cc25603c231bc2f568eb630ea16aa137d2664ac80388256084f8ae3bd7535248d0bd448298cc2e2071e56992d0774dc340c368ae950852ada1c";

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
    return (
      <Base
        address={this.props.address}
        scan={this.state.scan}
        toggleScanner={this.toggleScanner}
        onScan={this.onScan}
      >
        <StyledWrapper>
          <StyledTitle>{"Dashboard"}</StyledTitle>
          <p>{this.props.name}</p>
          <div>
            <Button onClick={this.toggleScanner}>{"Scan"}</Button>
          </div>
          {this.state.uri && (
            <StyledQRCodeWrapper>
              <QRCodeDisplay data={this.state.uri} />
            </StyledQRCodeWrapper>
          )}
        </StyledWrapper>
      </Base>
    );
  }
}

const reduxProps = ({ account }) => ({
  name: account.name,
  address: account.address
});

export default connect(
  reduxProps,
  null
)(Dashboard);
