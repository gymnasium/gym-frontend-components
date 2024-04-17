import React from 'react';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['GYM_MAIN_NAV'], 'MainMenu');

const getMainNav = () => getConfig().GYM_MAIN_NAV;

const MainMenu = ({
  secondaryNav,
}) => {
  return (
    <ul role="list">

      {getMainNav() && getMainNav().map((item, index) => {
        let activeAria;
        let activeClass;
        if (secondaryNav && item.href.includes(secondaryNav)) {
          activeAria = 'page';
          activeClass = 'active';
        };
        return (
          <li key={`main-item-${index}`}><a href={item.href} aria-current={activeAria} className={activeClass}>{item.label}</a></li>
        );
      })}
    </ul>
  )
};

export default MainMenu;
