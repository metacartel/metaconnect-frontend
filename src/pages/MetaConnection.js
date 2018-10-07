import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Base from "../layouts/base";
import Column from "../components/Column";
import Button from "../components/Button";
import SocialMediaCard from "../components/SocialMediaCard";
import {
  metaConnectionHide,
  metaConnectionApprove,
  metaConnectionReject
} from "../reducers/_metaConnection";
import { formatHandle, cleanHandle } from "../helpers/utilities";
import { responsive } from "../styles";

const StyledWrapper = styled(Column)`
  height: 100%;
  padding: 20px;
  min-height: 100vh;
  @media screen and (${responsive.sm.max}) {
    padding: 20px 0;
    padding-top: 50px;
  }
`;

const StyledProfile = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 50px;
  @media screen and (${responsive.sm.max}) {
    margin-bottom: 15px;
  }
`;

const StyledName = styled.h3`
  & span {
    margin-right: 12px;
  }
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
    const { _name, request, name, socialMedia } = this.props;
    return (
      <Base>
        <StyledWrapper maxWidth={400}>
          <StyledProfile>
            <StyledName>
              <span>{`👩‍🚀`}</span>
              {`@${_name}`}
            </StyledName>
            <p>
              {request
                ? "You have a new MetaConnection! 🎉"
                : "Check out your MetaConnection ❤️"}
            </p>
          </StyledProfile>

          <SocialMediaCard name={name} socialMedia={socialMedia} />

          {request ? (
            <StyledActions>
              <StyledButton
                outline
                color="red"
                onClick={this.props.metaConnectionHide}
              >
                {"Go Back"}
              </StyledButton>
            </StyledActions>
          ) : (
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
          )}
        </StyledWrapper>
      </Base>
    );
  };
}

EditSocialMedia.propTypes = {
  metaConnectionHide: PropTypes.func.isRequired,
  metaConnectionApprove: PropTypes.func.isRequired,
  metaConnectionReject: PropTypes.func.isRequired
};

const reduxProps = ({ account, metaConnection }) => ({
  _name: account.name,
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
