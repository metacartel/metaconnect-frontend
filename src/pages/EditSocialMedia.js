import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Base from "../layouts/base";
import Card from "../components/Card";
import Column from "../components/Column";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import CloseButton from "../components/CloseButton";
import { accountUpdateSocialMedia } from "../reducers/_account";
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

const StyledForm = styled(Form)`
  padding: 25px 10px 10px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
  margin: 20px 0;
  padding: 12px 20px;
`;

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  z-index: 10;
  top: 15px;
  right: 15px;
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
  render = () => (
    <Base>
      <StyledWrapper maxWidth={400}>
        <StyledProfile>
          <StyledName>
            <span>{`👩‍🚀`}</span>
            {`@${this.props.name}`}
          </StyledName>
        </StyledProfile>

        <Card>
          <StyledCloseButton color="red" onClick={this.onClose} />
          <StyledForm onSubmit={this.onSubmit}>
            <Input
              label="Twitter"
              placeholder="@twitter"
              type="text"
              color={"lightGrey"}
              shadow={false}
              value={this.state.twitter}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, true, "twitter")
              }
            />
            <Input
              label="Telegram"
              placeholder="@telegram"
              type="text"
              color={"lightGrey"}
              shadow={false}
              value={this.state.telegram}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, true, "telegram")
              }
            />
            <Input
              label="Github"
              placeholder="@github"
              type="text"
              color={"lightGrey"}
              shadow={false}
              value={this.state.github}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, true, "github")
              }
            />

            <Input
              label="Linkedin"
              placeholder="@linkedin"
              type="text"
              color={"lightGrey"}
              shadow={false}
              value={this.state.linkedin}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, true, "linkedin")
              }
            />

            <Input
              label="Phone"
              placeholder="+13442321010"
              type="text"
              color={"lightGrey"}
              shadow={false}
              value={this.state.phone}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, false, "phone")
              }
            />

            <Input
              label="Email"
              placeholder="johndoe@email.com"
              type="email"
              color={"lightGrey"}
              shadow={false}
              value={this.state.email}
              autoCapitalize="off"
              onChange={({ target }) =>
                this.updateHandle(target.value, false, "email")
              }
            />

            <StyledButton color="red" textTransform="uppercase" type="submit">
              {"Confirm"}
            </StyledButton>
          </StyledForm>
        </Card>
      </StyledWrapper>
    </Base>
  );
}

EditSocialMedia.propTypes = {
  accountUpdateSocialMedia: PropTypes.func.isRequired
};

const reduxProps = ({ account }) => ({
  name: account.name,
  socialMedia: account.socialMedia
});

export default connect(
  reduxProps,
  {
    accountUpdateSocialMedia
  }
)(EditSocialMedia);
