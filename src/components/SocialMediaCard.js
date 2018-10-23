import React from "react";
import styled from "styled-components";
import Card from "../components/Card";
import Column from "../components/Column";
import Icon from "../components/Icon";
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
  padding: 20px;
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
    margin: 6px 0;
    border: 1px solid rgb(${colors.dark});
    padding: 6px;
    border-radius: 6px;
  }
`;

const StyledIcon = styled(Icon)`
  margin-right: 10px;
`;

const SocialMediaCard = ({ name, socialMedia, ...props }) => (
  <Card {...props}>
    <StyledWrapper>
      <StyledProfile>
        <StyledName>{formatHandle(name)}</StyledName>
        <StyledSocialMediaWrapper>
          <StyledSocialMedia>
            {!!socialMedia.twitter && (
              <a
                href={`https://twitter.com/${socialMedia.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={twitter} />
                <p>{formatHandle(socialMedia.twitter)}</p>
              </a>
            )}
            {!!socialMedia.telegram && (
              <a
                href={`https://t.me/${socialMedia.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={telegram} />
                <p>{formatHandle(socialMedia.telegram)}</p>
              </a>
            )}
            {!!socialMedia.github && (
              <a
                href={`https://github.com/${socialMedia.github}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={github} />
                <p>{formatHandle(socialMedia.github)}</p>
              </a>
            )}

            {!!socialMedia.linkedin && (
              <a
                href={`https://linkedin.com/in/${socialMedia.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={linkedin} />
                <p>{formatHandle(socialMedia.linkedin)}</p>
              </a>
            )}
            {!!socialMedia.email && (
              <a
                href={`mailto:${socialMedia.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={email} />
                <p>{formatHandle(socialMedia.email)}</p>
              </a>
            )}
            {!!socialMedia.phone && (
              <a
                href={`tel:${socialMedia.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon color="dark" icon={phone} />
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
