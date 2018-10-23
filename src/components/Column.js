import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledColumn = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
  text-align: ${({ align }) => align}
  align-items: ${({ align }) => {
    switch (align) {
      case "left":
        return "flex-start";
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "center";
    }
  }}
`;

const Column = ({
  children,
  spanHeight,
  maxWidth,
  center,
  align,
  ...props
}) => (
  <StyledColumn
    spanHeight={spanHeight}
    maxWidth={maxWidth}
    center={center}
    align={align}
    {...props}
  >
    {children}
  </StyledColumn>
);

Column.propTypes = {
  children: PropTypes.node.isRequired,
  spanHeight: PropTypes.bool,
  maxWidth: PropTypes.number,
  center: PropTypes.bool,
  align: PropTypes.oneOf(["left", "center", "right"])
};

Column.defaultProps = {
  spanHeight: false,
  maxWidth: 600,
  center: false,
  align: "center"
};

export default Column;
