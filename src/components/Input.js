import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, fonts, shadows, responsive } from "../styles";

const StyledInputWrapper = styled.div`
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? "0.5" : "1")};
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const StyledLabel = styled.label`
  font-weight: ${({ required }) => (required ? fonts.weight.bold : "inherit")};
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  align-self: start;
  width: 100%;
  margin-left: 6px;
  text-align: left;
`;

const StyledInput = styled.input`
  width: 100%;
  margin-top: 8px;
  background: ${({ color }) => `rgb(${colors[color]})`};
  padding: 12px;
  border: none;
  border-style: none;
  font-family: ${({ monospace }) =>
    monospace ? `${fonts.family.SFMono}` : `inherit`};
  font-size: ${fonts.size.h6};
  font-weight: ${fonts.weight.semibold};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  border-radius: 8px;
  -webkit-box-shadow: ${({ shadow }) => (shadow ? shadows.medium : "none")};
  box-shadow: ${({ shadow }) => (shadow ? shadows.medium : "none")};
  outline: none;
  &::placeholder {
    color: rgba(${colors.grey}, 0.8);
    font-weight: ${fonts.weight.medium};
    opacity: 1;
  }
  @media screen and (${responsive.sm.max}) {
    padding: 8px 10px;
  }
`;

const Input = ({
  required,
  label,
  color,
  type,
  disabled,
  value,
  shadow,
  placeholder,
  monospace,
  ...props
}) => {
  return (
    <StyledInputWrapper disabled={disabled}>
      <StyledLabel required={required} hide={label === "Input"}>
        {label}
      </StyledLabel>
      <StyledInput
        required={required}
        disabled={disabled}
        color={color}
        shadow={shadow}
        type={type}
        value={!disabled ? value : ""}
        placeholder={placeholder}
        monospace={monospace}
        {...props}
      />
    </StyledInputWrapper>
  );
};

Input.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  shadow: PropTypes.bool,
  placeholder: PropTypes.string,
  monospace: PropTypes.bool,
  disabled: PropTypes.bool
};

Input.defaultProps = {
  label: "",
  color: "white",
  shadow: true,
  placeholder: "",
  monospace: false,
  disabled: false
};

export default Input;
