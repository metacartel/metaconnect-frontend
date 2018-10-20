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
import { accountUpdateName } from "../reducers/_account";
import { formatHandle, handleMetaConnectionURI } from "../helpers/utilites";
import { fonts, colors } from "../styles";

const StyledWrapper = styled(Column)`
  width: 100%;
  height: 100%;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledTitle = styled.h2`
  margin: 20px 0;
`;

const StyledSubtitle = styled.p`
  font-size: ${fonts.size.h4};
  margin: 40px 0;
`;

const StyledRedLine = styled.div`
  background: rgb(${colors.red});
  width: 62px;
  height: 3px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
  margin: 20px 0;
  padding: 12px 20px;
`;

class Home extends Component {
  state = {
    name: ""
  };
  updateName = ({ target }) => {
    const input = target.value;
    const name = !!input ? "@" + input.replace(/[\s@]/gi, "") : "";
    this.setState({ name });
  };
  onSubmit = () => {
    const name = this.state.name.replace(/@/gi, "");
    this.props.accountUpdateName(name);
    if (this.props.metaConnectionName) {
      window.browserHistory.push("/meta-connection");
    } else {
      window.browserHistory.push("/dashboard");
    }
  };
  render() {
    let title = "MetaConnect";
    let subtitle = "A meta connection to start your journey using Ethereum";
    const result = handleMetaConnectionURI(this.props.location.search);
    if (result) {
      title = `You were invited by ${formatHandle(result.metaConnection.name)}`;
      subtitle = "Choose a username below to start your metaconnection";
    }
    return (
      <Base>
        <StyledWrapper maxWidth={400}>
          <StyledTitle>{title}</StyledTitle>
          <StyledRedLine />
          <StyledSubtitle>{subtitle}</StyledSubtitle>
          <Card>
            <Form onSubmit={this.onSubmit}>
              <Input
                label="👩‍🚀 Username:"
                placeholder="@carlosmatos"
                type="text"
                color={"lightGrey"}
                shadow={false}
                value={this.state.name}
                onChange={this.updateName}
              />
              <StyledButton color="red" textTransform="uppercase" type="submit">
                {"Start 🚀"}
              </StyledButton>
            </Form>
          </Card>
        </StyledWrapper>
      </Base>
    );
  }
}

Home.propTypes = {
  accountUpdateName: PropTypes.func.isRequired
};

const reduxProps = ({ metaConnection }) => ({
  metaConnectionName: metaConnection.name
});

export default connect(
  reduxProps,
  {
    accountUpdateName
  }
)(Home);
