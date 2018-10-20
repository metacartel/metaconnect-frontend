import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Column from "./Column";
import { colors } from "../styles";

const StyledCard = styled(Column)`
  width: 100%;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  background-color: rgb(${colors.white});
  color: rgb(${colors.dark});
  border-radius: 20px;
  overflow: hidden;
`;

const Card = ({ children, maxWidth, ...props }) => (
  <StyledCard maxWidth={maxWidth} {...props}>
    {children}
  </StyledCard>
);

Card.propTypes = {
  maxWidth: PropTypes.number
};

Card.defaultProps = {
  maxWidth: 400
};

export default Card;
