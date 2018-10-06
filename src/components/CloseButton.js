import React from "react";
import styled from "styled-components";
import AddButton from "./AddButton";

const StyledCloseButton = styled(AddButton)`
  transform: rotate(45deg);
`;

const CloseButton = ({ color, ...props }) => (
  <StyledCloseButton color={color} {...props} />
);

export default CloseButton;
