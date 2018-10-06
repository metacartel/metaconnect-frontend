import React from "react";
import styled from "styled-components";
import { colors } from "../styles";

const StyledCard = styled.div`
  background-color: rgb(${colors.white})
  border-radius: 20px;
`;

const Card = ({ children, ...props }) => (
  <StyledCard {...props}>{children}</StyledCard>
);

export default Card;
