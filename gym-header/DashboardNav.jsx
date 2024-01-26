import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';

const DashboardNav = ({ username }) => {
  return (
    <ul role="list">
      <li key="account-item-1"><a href={`${getConfig().ACCOUNT_PROFILE_URL}/u/${username}`}>
        Profile
      </a></li>
      <li key="account-item-2"><a href={getConfig().ACCOUNT_SETTINGS_URL}>
        Account
      </a></li>
    </ul>
  );
};

DashboardNav.propTypes = {
  username: PropTypes.string,
};

export default DashboardNav;
