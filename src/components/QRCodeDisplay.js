import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import qrImage from "qr-image";

const StyledWrapper = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 100%;
  }
`;

class QRCodeDisplay extends Component {
  state = {
    img: ""
  };

  componentDidMount() {
    this.updateQRCodeImage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data });
      this.updateQRCodeImage();
    }
  }

  updateQRCodeImage() {
    this.setState({ img: "" });
    if (this.props.data) {
      const img = qrImage.imageSync(this.props.data, { type: "svg" });
      this.setState({ img });
    }
  }
  render = () =>
    this.state.img ? (
      <StyledWrapper
        dangerouslySetInnerHTML={{ __html: this.state.img }}
        {...this.props}
      />
    ) : null;
}

QRCodeDisplay.propTypes = {
  data: PropTypes.string.isRequired
};

export default QRCodeDisplay;
