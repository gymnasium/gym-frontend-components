import React from 'react';

import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';

ensureConfig(['LMS_BASE_URL','GYM_LOGIN_LABEL', 'GYM_REGISTER_LABEL'], 'AnonUserMenu');

const getLmsUrl = () => getConfig().LMS_BASE_URL;
const getLoginLabel = () => getConfig().GYM_LOGIN_LABEL;
const getRegisterLabel = () => getConfig().GYM_REGISTER_LABEL;

const AnonUserMenu = ({ }) => (
  <ul className="auth" role="list">
    <li key="unauth-item-1"><a
      href={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {getLoginLabel()}
    </a></li>
    <li key="unauth-item-2"><a className="btn"
      href={`${getLmsUrl()}/register?next=${encodeURIComponent(global.location.href)}`}
    >
      {getRegisterLabel()}
    </a></li>
  </ul>
);

AnonUserMenu.propTypes = {

};

export default AnonUserMenu;
