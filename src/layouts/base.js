import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Link from "../components/Link";
import Wrapper from "../components/Wrapper";
import Column from "../components/Column";
import Notification from "../components/Notification";
import { Blockie } from "dapparatus";
import { ellipseAddress } from "../helpers/utilities";
import metaconnect from "../assets/metaconnect.png";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;

const StyledContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const StyledBrandingWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledBranding = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  background: url(${metaconnect}) no-repeat;
  background-size: cover;
  background-position: center;
`;

const StyledActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`;

const BaseLayout = ({
  children,
  accountType,
  accountAddress,
  network,
  ...props
}) => {
  return (
    <StyledLayout>
      <Column maxWidth={1000} spanHeight>
        <StyledHeader>
          <Link to="/">
            <StyledBrandingWrapper>
              <StyledBranding alt="MetaConnect" />
              <h1>MetaConnect</h1>
            </StyledBrandingWrapper>
          </Link>
          {accountAddress && (
            <Link to="/dashboard">
              <StyledActiveAccount>
                <Blockie address={accountAddress} />
                <p>{ellipseAddress(accountAddress)}</p>
              </StyledActiveAccount>
            </Link>
          )}
        </StyledHeader>
        <StyledContent>{children}</StyledContent>
      </Column>
      <Notification />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  accountType: PropTypes.string.isRequired,
  accountAddress: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired
};

const reduxProps = ({ account }) => ({
  accountType: account.type,
  accountAddress: account.address,
  network: account.network
});

export default connect(
  reduxProps,
  null
)(BaseLayout);
