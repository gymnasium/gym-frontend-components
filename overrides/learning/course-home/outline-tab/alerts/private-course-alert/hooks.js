/* eslint-disable import/prefer-default-export */
import React, { useContext, useMemo } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { ALERT_TYPES, useAlert } from '@src/generic/user-messages';
import { useModel } from '@src/generic/model-store';

const PrivateCourseAlert = React.lazy(() => import('./PrivateCourseAlert'));

export function usePrivateCourseAlert(courseId) {
  const { authenticatedUser } = useContext(AppContext);
  const course = useModel('courseHomeMeta', courseId);
  const outline = useModel('outline', courseId);
  const enrolledUser = course && course.isEnrolled !== undefined && course.isEnrolled;
  const privateOutline = outline && outline.courseBlocks && !outline.courseBlocks.courses;
  /**
   * This alert should render if the user is not enrolled AND
   *    1. the user is anonymous AND the outline is private, OR
   *    2. the user is authenticated.
   * */
  const isVisible = !enrolledUser && (privateOutline || authenticatedUser !== null);
  const payload = useMemo(() => ({
    anonymousUser: authenticatedUser === null,
    canEnroll: outline && outline.enrollAlert ? outline.enrollAlert.canEnroll : false,
    courseId,
  }), [authenticatedUser, courseId, outline]);

  useAlert(isVisible, {
    code: 'clientPrivateCourseAlert',
    dismissible: false,
    payload,
    topic: 'outline-private-alerts',
    type: ALERT_TYPES.WELCOME,
  });

  return { clientPrivateCourseAlert: PrivateCourseAlert };
}
