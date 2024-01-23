import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import GymSettings from '../data/settings';
const settings = await GymSettings();

const CoursesNav = ({}) => {
  return ( 
    <ul role="list">
      {settings.navigation.courses.map((item, index) => {
        return (
          <li key={`item-${index}`}><a href={item.href}>{item.title}</a></li>
        );
      })}
    </ul>
  )
};

CoursesNav.propTypes = {

};

export default CoursesNav;