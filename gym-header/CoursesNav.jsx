import React from 'react';

import { ensureConfig, getConfig } from '@edx/frontend-platform';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

ensureConfig(['GYM_COURSE_NAV'], 'CoursesNav');

const getCourseNav = () => getConfig().GYM_COURSE_NAV;

const CoursesNav = ({}) => {
  return ( 
    <ul role="list">
      {getCourseNav() && getCourseNav().map((item, index) => {
        return (
          <li key={`item-${index}`}><a href={item.href}>{item.label}</a></li>
        );
      })}
    </ul>
  )
};

CoursesNav.propTypes = {

};

export default CoursesNav;