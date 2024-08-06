import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import AnonUserMenu from './AnonUserMenu';
import AuthUserMenu from './AuthUserMenu';
import CoursesNav from './CoursesNav';
import DashboardNav from './DashboardNav';
import MainMenu from './MainMenu';

ensureConfig(['MARKETING_SITE_BASE_URL','SITE_NAME', 'GYM_LOGO_SRC', 'GYM_LOGO_SRCSET'], 'GymHeader');

const getBaseUrl = () => getConfig().MARKETING_SITE_BASE_URL;
const getSiteName = () => getConfig().SITE_NAME;
const getLogoSrc = () => getConfig().GYM_LOGO_SRC;
const getLogoSrcset = () => getConfig().GYM_LOGO_SRCSET;

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
      href={`${getBaseUrl()}`}
      src={`${getBaseUrl()}${getLogoSrc()}`}
      srcSet={`${getBaseUrl()}${getLogoSrcset()}`}
      alt={getSiteName()}
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
            {authenticatedUser && secondaryNav === `dashboard` && (
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
            <span className="course-id">{courseOrg}-{courseNumber}</span>
            <span className="course-title">{courseTitle}</span>
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
