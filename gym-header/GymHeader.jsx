import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import AnonUserMenu from './AnonUserMenu';
import AuthUserMenu from './AuthUserMenu';
import MainMenu from './MainMenu';
import DashboardNav from './DashboardNav';
import CoursesNav from './CoursesNav';

import GymSettings from '../settings';
const settings = await GymSettings();

const LinkedLogo = ({
  href,
  src,
  srcSet,
  alt,
  ...attributes
}) => (
  <a href={href} {...attributes}>
    <img src={src} srcSet={srcSet} alt={alt} />
  </a>
);

LinkedLogo.propTypes = {
  href: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcSet: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const GymHeader = ({
  secondaryNav,
  courseOrg, courseNumber, courseTitle,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const headerLogo = (
    <LinkedLogo
      className="logo"
      href={`${settings.urls.root}`}
      src={`${settings.urls.cms}${settings.logos.main.white.src}`}
      srcSet={`${settings.urls.cms}${settings.logos.main.white.srcset}`}
      alt={getConfig().SITE_NAME}
    />
  );

  return (
    <header className="site-header gym-header">
      <div className="container">
        <nav className="main" role="navigation" aria-label="Main">
          {headerLogo}
          <div className="wrapper">
            <MainMenu secondaryNav={secondaryNav} />
            {authenticatedUser && (
              <AuthUserMenu secondaryNav={secondaryNav}
                username={authenticatedUser.username}
              />
            )}
            {!authenticatedUser && (
              <AnonUserMenu />
            )}
          </div>
        </nav>
      </div>
      {secondaryNav && (
        <div className="container">
          <nav className="secondary" role="navigation" aria-label="Secondary">
            {secondaryNav === `dashboard` && authenticatedUser && (
              <DashboardNav
                username={authenticatedUser.username}
              />
            )}
            {secondaryNav === `courses` && (
              <CoursesNav />
            )}
          </nav>
        </div>
      )}
      {/* TODO: optionally add a course-specific header? */}
      {secondaryNav === `courses` && (courseOrg !== null && courseNumber !== null && courseTitle !== null) && (
        <div className="course-header">
          <div className="container">
            <span className="d-block small m-0">{courseOrg} {courseNumber}</span>
            <span className="d-block m-0 font-weight-bold course-title">{courseTitle}</span>
          </div>
        </div>
      )}
    </header>
  );
};

GymHeader.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  secondaryNav: PropTypes.string,
};

GymHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  secondaryNav: null,
};

export default GymHeader;
