import React from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';

import { ensureConfig, getConfig } from '@edx/frontend-platform';

// ensureConfig(['ACCOUNT_PROFILE_URL','ACCOUNT_SETTINGS_URL'], 'DashboardNav');

const getAccountProfileUrl = () => getConfig().ACCOUNT_PROFILE_URL;
const getAccountSettingsUrl = () => getConfig().ACCOUNT_SETTINGS_URL;

const DashboardNav = ({ activeLink, username }) => {
  const { authenticatedUser } = useContext(AppContext);

  const activeAttr = {
    className: 'active',
    'aria-current': 'page',
  };
  let accountActive = false;
  let profileActive = false;

  if (activeLink === 'account') {
    accountActive = activeAttr;
  } else if (activeLink === 'profile') {
    profileActive = activeAttr;
  }

  return (authenticatedUser &&
    <ul role="list">
      <li key="dashboard-item-1"><a href={`${getAccountProfileUrl()}/u/${username}`} {...profileActive}>
        Profile
      </a></li>
      <li key="dashboard-item-2"><a href={getAccountSettingsUrl()} {...accountActive}>
        Account
      </a></li>
    </ul>
  );
};

DashboardNav.propTypes = {
  username: PropTypes.string,
};

export default DashboardNav;
