import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import BaseLayout from "../layouts/base";
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
  onSubmit = () => {
    // do something
  };
  render = () => (
    <BaseLayout>
      <StyledColumn>
        <h1>MetaConnect</h1>
        <p>A crypto handshake to start your journey using Ethereum</p>
        <Form onSubmit={this.onSubmit}>
          <Input
            label=""
            placeholder="@username"
            type="text"
            value={this.props.name}
            onChange={({ target }) =>
              this.props.accountUpdateName(target.value)
            }
          />
          <StyledButton type="submit">Submit</StyledButton>
        </Form>
      </StyledColumn>
    </BaseLayout>
  );
}

Home.propTypes = {
  name: PropTypes.string.isRequired,
  accountUpdateName: PropTypes.func.isRequired
};

const reduxProps = ({ account }) => ({
  name: account.name
});

export default connect(
  reduxProps,
  {
    accountUpdateName
  }
)(Home);
