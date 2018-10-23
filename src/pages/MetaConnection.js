import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Base from "../layouts/base";
import Button from "../components/Button";
import SocialMediaCard from "../components/SocialMediaCard";
import {
  metaConnectionHide,
  metaConnectionApprove,
  metaConnectionReject
} from "../reducers/_metaConnection";
import { formatHandle, cleanHandle } from "../helpers/utilities";
import { fonts } from "../styles";

const StyledSubtitle = styled.p`
  font-size: ${fonts.size.h4};
  margin: 40px 0;
`;

const StyledActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
  margin: 15px;
  padding: 12px 20px;
`;

class EditSocialMedia extends Component {
  state = {
    twitter: formatHandle(this.props.socialMedia.twitter),
    telegram: formatHandle(this.props.socialMedia.telegram),
    github: formatHandle(this.props.socialMedia.github),
    linkedin: formatHandle(this.props.socialMedia.linkedin),
    phone: this.props.socialMedia.phone,
    email: this.props.socialMedia.email
  };
  updateHandle = (input, format, socialMedia) => {
    const handle = format ? formatHandle(input) : input.replace(/\s/gi, "");
    this.setState({ [socialMedia]: handle });
  };
  onSubmit = () => {
    const socialMedia = {};
    Object.keys(this.state).forEach(key => {
      const handle = this.state[key];
      if (handle && handle.trim().length) {
        socialMedia[key] = handle.startsWith("@")
          ? cleanHandle(handle)
          : handle;
      }
    });
    this.props.accountUpdateSocialMedia(socialMedia);
    this.onClose();
  };
  onClose = () => window.browserHistory.push("/dashboard");
  render = () => {
    const { request, name, socialMedia } = this.props;
    return (
      <Base>
        <StyledSubtitle>
          {request
            ? "You have a new MetaConnection! 🎉"
            : "Check out your MetaConnection ❤️"}
        </StyledSubtitle>

        <SocialMediaCard name={name} socialMedia={socialMedia} />

        {request ? (
          <StyledActions>
            <StyledButton
              outline
              color="red"
              onClick={this.props.metaConnectionReject}
            >
              {"Reject"}
            </StyledButton>
            <StyledButton
              outline
              color="green"
              onClick={this.props.metaConnectionApprove}
            >
              {"Approve"}
            </StyledButton>
          </StyledActions>
        ) : (
          <StyledActions>
            <StyledButton
              outline
              color="red"
              onClick={this.props.metaConnectionHide}
            >
              {"Go Back"}
            </StyledButton>
          </StyledActions>
        )}
      </Base>
    );
  };
}

EditSocialMedia.propTypes = {
  metaConnectionHide: PropTypes.func.isRequired,
  metaConnectionApprove: PropTypes.func.isRequired,
  metaConnectionReject: PropTypes.func.isRequired
};

const reduxProps = ({ metaConnection }) => ({
  request: metaConnection.request,
  name: metaConnection.name,
  socialMedia: metaConnection.socialMedia
});

export default connect(
  reduxProps,
  {
    metaConnectionHide,
    metaConnectionApprove,
    metaConnectionReject
  }
)(EditSocialMedia);
