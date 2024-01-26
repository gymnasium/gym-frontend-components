import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';

const DashboardNav = ({ activeLink, username }) => {
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

  return (
    <ul role="list">
      <li key="dashboard-item-1"><a href={`${getConfig().ACCOUNT_PROFILE_URL}/u/${username}`} {...profileActive}>
        Profile
      </a></li>
      <li key="dashboard-item-2"><a href={getConfig().ACCOUNT_SETTINGS_URL} {...accountActive}>
        Account
      </a></li>
    </ul>
  );
};

DashboardNav.propTypes = {
  username: PropTypes.string,
};

export default DashboardNav;
