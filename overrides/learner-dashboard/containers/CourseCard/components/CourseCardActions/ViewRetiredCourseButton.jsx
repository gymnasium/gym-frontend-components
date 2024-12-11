import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import track from '@src/tracking';
import { reduxHooks } from '@src/hooks';
import useActionDisabledState from '@src/containers/CourseCard/components/hooks';
import ActionButton from '@src/containers/CourseCard/components/CourseCardActions/ActionButton';
import messages from '@src/containers/CourseCard/components/CourseCardActions/messages';

export const ViewRetiredCourseButton = ({ cardId }) => {
  const { formatMessage } = useIntl();
  const { homeUrl } = reduxHooks.useCardCourseRunData(cardId);
  const { disableViewCourse } = useActionDisabledState(cardId);

  const handleClick = reduxHooks.useTrackCourseEvent(
    track.course.enterCourseClicked,
    cardId,
    homeUrl,
  );
  return (
    <ActionButton
      disabled={disableViewCourse}
      as="a"
      href="#"
      onClick={handleClick}
    >
      View Retired Course
    </ActionButton>
  );
};
ViewRetiredCourseButton.propTypes = {
  cardId: PropTypes.string.isRequired,
};
export default ViewRetiredCourseButton;
