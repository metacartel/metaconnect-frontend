import React from "react";
import styled from "styled-components";
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

const Base = ({ children, ...props }) => (
  <StyledLayout {...props}>
    <Column maxWidth={1000} spanHeight>
      <StyledContent>{children}</StyledContent>
    </Column>
    <Notification />
  </StyledLayout>
);

export default Base;
