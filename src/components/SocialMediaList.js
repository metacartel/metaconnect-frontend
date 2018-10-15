import React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import Icon from "../components/Icon";
import twitter from "../assets/twitter.svg";
import telegram from "../assets/telegram.svg";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";

const StyledSocialMediaWrapper = styled.div`
  margin: 8px 0;
`;

const StyledSocialMedia = styled.div`
  display: flex;
  & a > * {
    margin-left: 10px !important;
  }
  & a:first-child > div {
    margin-left: 0 !important;
  }
`;

const SocialMediaList = ({ socialMedia, ...props }) => (
  <StyledSocialMediaWrapper {...props}>
    {!Object.keys(socialMedia).length ? (
      <Link to="/edit-social-media">{"Add Social Media"}</Link>
    ) : (
      <StyledSocialMedia>
        {!!socialMedia.twitter && (
          <a
            href={`https://twitter.com/${socialMedia.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={twitter} />
          </a>
        )}
        {!!socialMedia.telegram && (
          <a
            href={`https://t.me/${socialMedia.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={telegram} />
          </a>
        )}
        {!!socialMedia.github && (
          <a
            href={`https://github.com/${socialMedia.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={github} />
          </a>
        )}

        {!!socialMedia.linkedin && (
          <a
            href={`https://linkedin.com/in/${socialMedia.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={linkedin} />
          </a>
        )}
        {!!socialMedia.email && (
          <a
            href={`mailto:${socialMedia.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={email} />
          </a>
        )}
        {!!socialMedia.phone && (
          <a
            href={`tel:${socialMedia.phone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={phone} />
          </a>
        )}
        <Link to="/edit-social-media">
          <span>{"edit"}</span>
        </Link>
      </StyledSocialMedia>
    )}
  </StyledSocialMediaWrapper>
);

export default SocialMediaList;
