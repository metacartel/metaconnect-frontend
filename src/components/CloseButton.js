import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, transitions } from "../styles";

const StyledCloseButton = styled.div`
  width: 35px;
  height: 35px;
  position: absolute;
  transform: rotate(45deg);
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.5;
  }
`;

const StyledFirstLine = styled.div`
  position: absolute;
  width: 90%;
  border: ${({ color }) => `1px solid rgb(${colors[color]})`};
  transition: ${transitions.base};
`;

const StyledSecondLine = styled.div`
  position: absolute;
  width: 90%;
  border: ${({ color }) => `1px solid rgb(${colors[color]})`};
  transform: rotate(90deg);
`;

const CloseButton = ({ color, ...props }) => (
  <StyledCloseButton {...props}>
    <StyledFirstLine color={color} />
    <StyledSecondLine color={color} />
  </StyledCloseButton>
);

CloseButton.propTypes = {
  color: PropTypes.string
};

CloseButton.defaultProps = {
  color: "black"
};

export default CloseButton;
