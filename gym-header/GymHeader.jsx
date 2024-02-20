import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import AnonUserMenu from './AnonUserMenu';
import AuthUserMenu from './AuthUserMenu';
import CoursesNav from './CoursesNav';
import DashboardNav from './DashboardNav';
import MainMenu from './MainMenu';

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
  courseNumber,
  courseOrg,
  courseTitle,
  activeLink,
  secondaryNav,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const headerLogo = (
    <LinkedLogo
      className="logo"
      href={`${settings.urls.root}`}
      src={`${settings.urls.data}${settings.logos.main.white.src}`}
      srcSet={`${settings.urls.data}${settings.logos.main.white.srcset}`}
      alt={getConfig().SITE_NAME}
    />
  );

  return (
    <header className="site-header gym-header">
      <div className="container">
        <nav className="main" role="navigation" aria-label="Main">
          {headerLogo}
          <div className="wrapper">
            <MainMenu secondaryNav={secondaryNav} activeLink={activeLink} />
            {authenticatedUser && (
              <AuthUserMenu secondaryNav={secondaryNav} activeLink={activeLink}
                username={authenticatedUser.username}
              />
            )}
            {!authenticatedUser && (
              <AnonUserMenu activeLink={activeLink} />
            )}
          </div>
        </nav>
      </div>
      {secondaryNav && (
        <div className="container">
          <nav className="secondary" role="navigation" aria-label="Secondary">
            {secondaryNav === `dashboard` && authenticatedUser && (
              <DashboardNav activeLink={activeLink}
                username={authenticatedUser.username}
              />
            )}
            {secondaryNav === `courses` && (
              <CoursesNav activeLink={activeLink} />
            )}
          </nav>
        </div>
      )}
      {/* TODO: optionally add a course-specific header? */}
      {secondaryNav === `courses` && (courseOrg !== null && courseNumber !== null && courseTitle !== null) && (
        <div className="course-header">
          <div className="container">
            <span className="d-block small m-0">{courseOrg}-{courseNumber}</span>
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
