import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import GymSettings from '../data/settings';
const settings = await GymSettings();

const MainMenu = ({}) => {
  return ( 
    <ul role="list">
      {settings.navigation.main.map((item, index) => {
        return (
          <li key={`main-item-${index}`}><a href={item.href}>{item.title}</a></li>
        );
      })}
    </ul>
  )
};

MainMenu.propTypes = {

};

export default MainMenu;