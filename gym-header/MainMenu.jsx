import React from 'react';
import GymSettings from '../settings';
const settings = await GymSettings();

const MainMenu = ({
  secondaryNav,
}) => {
  return (
    <ul role="list">
      {settings.header.nav.main.map((item, index) => {
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
