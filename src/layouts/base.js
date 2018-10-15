import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Column from "../components/Column";
import Notification from "../components/Notification";
import { responsive } from "../styles";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 0 16px;
  padding-top: 100px;
  @media screen and (${responsive.sm.max}) {
    padding-top: 0;
  }
`;

class Base extends Component {
  render() {
    return (
      <StyledLayout>
        <Column maxWidth={1000} spanHeight>
          <StyledContent>{this.props.children}</StyledContent>
        </Column>
        <Notification />
      </StyledLayout>
    );
  }
}

Base.propTypes = {
  children: PropTypes.node.isRequired,
  address: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired
};

const reduxProps = ({ account }) => ({
  address: account.address,
  network: account.network
});

export default connect(
  reduxProps,
  null
)(Base);
