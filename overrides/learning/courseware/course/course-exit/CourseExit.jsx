import React, { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import CourseCelebration from './CourseCelebration';
import CourseInProgress from '@src/courseware/course/course-exit/CourseInProgress';
import CourseNonPassing from '@src/courseware/course/course-exit/CourseNonPassing';
import { COURSE_EXIT_MODES, getCourseExitMode } from '@src/courseware/course/course-exit/utils';
import messages from '@src/courseware/course/course-exit/messages';
import { unsubscribeFromGoalReminders } from '@src/courseware/course/course-exit/data/thunks';

import { useModel } from '@src/generic/model-store';

const CourseExit = ({ intl }) => {
  const { courseId } = useSelector(state => state.courseware);
  const {
    certificateData,
    courseExitPageIsActive,
    courseGoals,
    enrollmentMode,
    hasScheduledContent,
    isEnrolled,
    userHasPassingGrade,
  } = useModel('coursewareMeta', courseId);

  const {
    isMasquerading,
    canViewCertificate,
  } = useModel('courseHomeMeta', courseId);

  const mode = getCourseExitMode(
    certificateData,
    hasScheduledContent,
    isEnrolled,
    userHasPassingGrade,
    courseExitPageIsActive,
    canViewCertificate,
  );

  // Audit users cannot fully complete a course, so we will
  // unsubscribe them from goal reminders once they reach the course exit page
  // to avoid spamming them with goal reminder emails
  if (courseGoals && enrollmentMode === 'audit' && !isMasquerading) {
    useEffect(() => {
      unsubscribeFromGoalReminders(courseId);
    }, []);
  }

  let body = null;
  if (mode === COURSE_EXIT_MODES.nonPassing) {
    body = (<CourseNonPassing />);
  } else if (mode === COURSE_EXIT_MODES.inProgress) {
    body = (<CourseInProgress />);
  } else if (mode === COURSE_EXIT_MODES.celebration) {
    body = (<CourseCelebration />);
  } else {
    return (<Navigate to={`/course/${courseId}`} replace />);
  }

  return (
    <>
      <div className="row w-100 mt-2 mb-4 justify-content-end">
        <Button
          variant="outline-primary"
          href={`${getConfig().LMS_BASE_URL}/dashboard`}
        >
          {intl.formatMessage(messages.viewCoursesButton)}
        </Button>
      </div>
      {body}
    </>
  );
};

CourseExit.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseExit);
