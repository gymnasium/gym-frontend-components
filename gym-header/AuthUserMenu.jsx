import React from 'react';

import { getConfig } from '@edx/frontend-platform';

import GymSettings from '../settings';
const settings = await GymSettings();

const AuthUserMenu = ({}) => (
  <ul className="auth" role="list">
    <li key="auth-item-1"><a
      href={`${getConfig().LMS_BASE_URL}/dashboard`}
    >
      {settings.navigation.auth.private[0].title}
    </a></li>
    <li key="auth-item-2"><a
      href={getConfig().LOGOUT_URL}
    >
      {settings.navigation.auth.private[1].title}
    </a></li>
  </ul>
);

AuthUserMenu.propTypes = {

};

export default AuthUserMenu;
