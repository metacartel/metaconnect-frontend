import React from "react";
import styled from "styled-components";
import Card from "../components/Card";
import Column from "../components/Column";
import twitter from "../assets/twitter.svg";
import telegram from "../assets/telegram.svg";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";
import { formatHandle } from "../helpers/utilities";
import { colors, responsive } from "../styles";

const StyledWrapper = styled(Column)`
  padding: 25px;
  height: 100%;
  @media screen and (${responsive.sm.max}) {
    padding: 25px 0;
  }
`;

const StyledProfile = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const StyledName = styled.h3`
  & span {
    margin-right: 12px;
  }
`;

const StyledSocialMediaWrapper = styled.div`
  margin: 8px 0;
`;

const StyledSocialMedia = styled.div`
  display: flex;
  flex-direction: column;
  & a {
    display: flex;
  }
  & a > * {
    margin-left: 10px !important;
  }
  & a:first-child > div {
    margin-left: 0 !important;
  }
`;

const StyledSocialMediaIcon = styled.div`
  width: 20px;
  height: 20px;
  mask: ${({ icon }) => `url(${icon}) center no-repeat`};
  mask-size: 90%;
  background-color: ${({ color }) => `rgb(${colors[color]})`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const SocialMediaCard = ({ name, socialMedia, ...props }) => (
  <Card {...props}>
    <StyledWrapper>
      <StyledProfile>
        <StyledName>
          <span>{`👩‍🚀`}</span>
          {`@${name}`}
        </StyledName>
        <StyledSocialMediaWrapper>
          <StyledSocialMedia>
            {!!socialMedia.twitter && (
              <a href={`https://twitter.com/${socialMedia.twitter}`}>
                <StyledSocialMediaIcon color="dark" icon={twitter} />
                <p>{formatHandle(socialMedia.twitter)}</p>
              </a>
            )}
            {!!socialMedia.telegram && (
              <a href={`https://t.me/${socialMedia.telegram}`}>
                <StyledSocialMediaIcon color="dark" icon={telegram} />
                <p>{formatHandle(socialMedia.telegram)}</p>
              </a>
            )}
            {!!socialMedia.github && (
              <a href={`https://github.com/${socialMedia.github}`}>
                <StyledSocialMediaIcon color="dark" icon={github} />
                <p>{formatHandle(socialMedia.github)}</p>
              </a>
            )}

            {!!socialMedia.linkedin && (
              <a href={`https://linkedin.com/in/${socialMedia.linkedin}`}>
                <StyledSocialMediaIcon color="dark" icon={linkedin} />
                <p>{formatHandle(socialMedia.linkedin)}</p>
              </a>
            )}
            {!!socialMedia.email && (
              <a href={`mailto:${socialMedia.email}`}>
                <StyledSocialMediaIcon color="dark" icon={email} />
                <p>{formatHandle(socialMedia.email)}</p>
              </a>
            )}
            {!!socialMedia.phone && (
              <a href={`tel:${socialMedia.phone}`}>
                <StyledSocialMediaIcon color="dark" icon={phone} />
                <p>{formatHandle(socialMedia.phone)}</p>
              </a>
            )}
          </StyledSocialMedia>
        </StyledSocialMediaWrapper>
      </StyledProfile>
    </StyledWrapper>
  </Card>
);

export default SocialMediaCard;
