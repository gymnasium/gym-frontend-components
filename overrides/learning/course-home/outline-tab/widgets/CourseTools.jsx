import React from 'react';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark, faCertificate, faInfo, faCalendar, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons';

import messages from '@src/course-home/outline-tab/messages';
import { useModel } from '@src/generic/model-store';
// import LaunchCourseHomeTourButton from '@src/product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';

const CourseTools = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);
  const { org } = useModel('courseHomeMeta', courseId);
  const {
    courseTools,
  } = useModel('outline', courseId);

  if (courseTools.length === 0) {
    return null;
  }

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  const renderIcon = (iconClasses) => {
    switch (iconClasses) {
      case 'edx.bookmarks':
        return faBookmark;
      case 'edx.tool.verified_upgrade':
        return faCertificate;
      case 'edx.tool.financial_assistance':
        return faInfo;
      case 'edx.calendar-sync':
        return faCalendar;
      case 'edx.updates':
        return faNewspaper;
      case 'edx.reviews':
        return faStar;
      default:
        return null;
    }
  };

  return (
    <section className="sidebar-course-tools mb-4">
      <h2 className="h4">{intl.formatMessage(messages.tools)}</h2>
      <ul className="list-unstyled">
        {courseTools.map((courseTool) => (
          <li key={courseTool.analyticsId} className="small">
            <a href={courseTool.url}>
              <FontAwesomeIcon icon={renderIcon(courseTool.analyticsId)} className="mr-2" fixedWidth />
              {courseTool.title}
            </a>
          </li>
        ))}
        {/* <li className="small" id="courseHome-launchTourLink">
          <LaunchCourseHomeTourButton />
        </li> */}
      </ul>
    </section>
  );
};

CourseTools.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseTools);
