import React from "react";
import styled from "styled-components";
import Base from "../layouts/base";
import Link from "../components/Link";

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-transform: uppercase;
  text-align: center;
  height: 100%;
`;

const NotFound = () => (
  <Base>
    <StyledWrapper>
      <Link to="/">
        <h3>{"Not Found"}</h3>
      </Link>
    </StyledWrapper>
  </Base>
);
export default NotFound;
