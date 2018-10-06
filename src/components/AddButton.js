import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, transitions } from "../styles";

const StyledAddButton = styled.div`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  position: relative;
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

const AddButton = ({ color, ...props }) => (
  <StyledAddButton {...props}>
    <StyledFirstLine color={color} />
    <StyledSecondLine color={color} />
  </StyledAddButton>
);

AddButton.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number
};

AddButton.defaultProps = {
  color: "white",
  size: 30
};

export default AddButton;
