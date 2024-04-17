import React from 'react';

import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['LMS_BASE_URL','LOGOUT_URL', 'GYM_DASHBOARD_LABEL', 'GYM_LOGOUT_LABEL'], 'AuthUserMenu');

const getLmsUrl = () => getConfig().LMS_BASE_URL;
const getLogoutUrl = () => getConfig().LOGOUT_URL;
const getDashLabel = () => getConfig().GYM_DASHBOARD_LABEL;
const getLogoutLabel = () => getConfig().GYM_LOGOUT_LABEL;

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
      href={`${getLmsUrl()}/dashboard`}
      aria-current={activeAria}
      className={activeClass}
    >
      {getDashLabel()}
    </a></li>
    <li key="auth-item-2"><a
      href={getLogoutUrl()}
    >
      {getLogoutLabel()}
    </a></li>
  </ul>
)};

AuthUserMenu.propTypes = {

};

export default AuthUserMenu;
