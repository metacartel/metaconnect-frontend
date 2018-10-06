import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import QrReader from "react-qr-reader";
import Column from "./Column";
import CloseButton from "./CloseButton";
import { colors } from "../styles";

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  margin: 0 auto !important;
  background: rgb(${colors.black});
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  z-index: 10;
  top: 15px;
  right: 15px;
`;

class QRCodeScanner extends Component {
  state = {
    delay: 500
  };
  stopRecording = () => this.setState({ delay: false });
  handleScan = data => {
    if (data) {
      const validate = this.props.onValidate(data);
      if (validate.result) {
        this.stopRecording();
        this.props.onScan(validate.data);
      } else {
        validate.onError();
      }
    }
  };
  handleError = error => {
    console.error(error);
    this.props.onError(error);
  };
  onClose = () => {
    this.stopRecording();
    this.props.onClose();
  };
  componentWillUnmount() {
    this.stopRecording();
  }
  render() {
    return (
      <StyledWrapper>
        <StyledCloseButton onClick={this.onClose} />
        <Column spanHeight center>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: "100%" }}
          />
        </Column>
      </StyledWrapper>
    );
  }
}

QRCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired
};

export default QRCodeScanner;
