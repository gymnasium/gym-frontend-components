import React from 'react';

import { getConfig } from '@edx/frontend-platform';

import GymSettings from '../settings';
const settings = await GymSettings();

const AuthUserMenu = ({secondaryNav}) => {
  let activeAria;
  let activeClass;
  if (secondaryNav == 'dashboard') {
    activeAria = 'page';
    activeClass = 'active';
  };
  return (
  <ul className="auth" role="list">
    <li key="auth-item-1"><a
      href={`${getConfig().LMS_BASE_URL}/dashboard`}
      aria-current={activeAria}
      className={activeClass}
    >
      {settings.header.nav.auth.private[0].label}
    </a></li>
    <li key="auth-item-2"><a
      href={getConfig().LOGOUT_URL}
    >
      {settings.header.nav.auth.private[1].label}
    </a></li>
  </ul>
)};

AuthUserMenu.propTypes = {

};

export default AuthUserMenu;
