import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import BaseLayout from "../layouts/base";

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

class Dashboard extends Component {
  render() {
    return (
      <BaseLayout>
        <StyledWrapper>
          <StyledTitle>{"Dashboard"}</StyledTitle>
          <p>{this.props.name}</p>
        </StyledWrapper>
      </BaseLayout>
    );
  }
}

const reduxProps = ({ account }) => ({
  name: account.name
});

export default connect(
  reduxProps,
  null
)(Dashboard);
