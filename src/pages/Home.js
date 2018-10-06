import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Base from "../layouts/base";
import Column from "../components/Column";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import { accountUpdateName } from "../reducers/_account";

const StyledColumn = styled(Column)`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  height: auto;
  margin: 20px;
  padding: 12px 20px;
`;

class Home extends Component {
  state = {
    name: ""
  };
  onSubmit = () => {
    this.props.accountUpdateName(this.state.name);
    window.browserHistory.push("/dashboard");
  };
  render = () => (
    <Base>
      <StyledColumn>
        <h1>MetaConnect</h1>
        <p>A crypto handshake to start your journey using Ethereum</p>
        <Form onSubmit={this.onSubmit}>
          <Input
            label="Username"
            placeholder="@username"
            type="text"
            value={this.state.name}
            onChange={({ target }) => this.setState({ name: target.value })}
          />
          <StyledButton type="submit">Submit</StyledButton>
        </Form>
      </StyledColumn>
    </Base>
  );
}

Home.propTypes = {
  accountUpdateName: PropTypes.func.isRequired
};

export default connect(
  null,
  {
    accountUpdateName
  }
)(Home);
