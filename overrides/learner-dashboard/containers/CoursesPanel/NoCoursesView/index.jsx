import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Image } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';
import { baseAppUrl, coursesUrl } from '../../../data/services/lms/urls';

import { reduxHooks } from 'hooks';

import messages from 'containers/CoursesPanel/NoCoursesView/messages';

export const NoCoursesView = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  return (
    <div
      id="no-courses-content-view"
      className="no-courses-content-view"
    >
      <h1>
        {formatMessage(messages.lookingForChallengePrompt)}
      </h1>
      <p>
        {formatMessage(messages.exploreCoursesPrompt)}
      </p>
      <Button
        variant="brand"
        as="a"
        href={coursesUrl()}
        iconBefore={Search}
      >
        {formatMessage(messages.exploreCoursesButton)}
      </Button>
    </div>
  );
};

export default NoCoursesView;
