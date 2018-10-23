import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Wrapper from "../components/Wrapper";
import Column from "../components/Column";
import Notification from "../components/Notification";
import SocialMediaList from "../components/SocialMediaList";
import { formatHandle } from "../helpers/utilities";
import { responsive } from "../styles";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  // min-height: 100vh;
  text-align: center;
`;

const StyledProfile = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 20px;
`;

const StyledName = styled.h3`
  & span {
    margin-right: 12px;
  }
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
  padding-top: 60px;
  @media screen and (${responsive.sm.max}) {
    padding-top: 0;
  }
`;

const StyledWrapper = styled(Column)`
  width: 100%;
  height: 100%;
  padding: 20px;
  padding-top: ${({ paddingTop }) => (paddingTop ? "60px" : "20px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (${responsive.sm.max}) {
    padding: 20px 0;
    padding-top: 50px;
  }
`;

const Base = ({
  children,
  name,
  socialMedia,
  showSocialMedia,
  paddingTop,
  ...props
}) => (
  <StyledLayout {...props}>
    <Column maxWidth={1000} spanHeight>
      <StyledContent>
        <StyledWrapper paddingTop={paddingTop} maxWidth={400}>
          <StyledProfile>
            <StyledName>{formatHandle(name)}</StyledName>
            {showSocialMedia && <SocialMediaList socialMedia={socialMedia} />}
          </StyledProfile>
          {children}
        </StyledWrapper>
      </StyledContent>
    </Column>
    <Notification />
  </StyledLayout>
);

Base.propTypes = {
  name: PropTypes.string.isRequired,
  socialMedia: PropTypes.object.isRequired,
  showSocialMedia: PropTypes.bool,
  paddingTop: PropTypes.bool
};

Base.defaultProps = {
  showSocialMedia: false,
  paddingTop: false
};

const reduxProps = ({ account }) => ({
  name: account.name,
  socialMedia: account.socialMedia
});

export default connect(
  reduxProps,
  null
)(Base);
