import React from 'react';
import PropTypes from 'prop-types';

import { Button, ActionRow } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';

import SelectSessionButton from '@src/containers/CourseCard/components/CourseCardActions/SelectSessionButton';
import BeginCourseButton from '@src/containers/CourseCard/components/CourseCardActions/BeginCourseButton';
import ResumeButton from '@src/containers/CourseCard/components/CourseCardActions/ResumeButton';
import ViewCourseButton from '@src/containers/CourseCard/components/CourseCardActions/ViewCourseButton';

import EmailSettingsModal from '@src/containers/EmailSettingsModal';
import UnenrollConfirmModal from '@src/containers/UnenrollConfirmModal';
import {
  useEmailSettings,
  useUnenrollData,
  useOptionVisibility,
} from '@src/containers/CourseCard/components/CourseCardMenu/hooks';

import messages from '@src/containers/CourseCard/components/CourseCardMenu/messages';

export const CourseCardActions = ({ cardId }) => {
  const certificate = reduxHooks.useCardCertificateData(cardId);
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);
  const {
    isVerified,
    hasStarted,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);

  const { formatMessage } = useIntl();

  const emailSettings = useEmailSettings();
  const unenrollModal = useUnenrollData();
  const { shouldShowUnenrollItem } = useOptionVisibility(cardId);
  const { isMasquerading } = reduxHooks.useMasqueradeData();
  const { isEmailEnabled } = reduxHooks.useCardEnrollmentData(cardId);

  return (
    <ActionRow data-test-id="CourseCardActions">
      {isEntitlement && (isFulfilled
        ? <ViewCourseButton cardId={cardId} />
        : <SelectSessionButton cardId={cardId} />
      )}
      {(isArchived && !isEntitlement) && (
        <ViewCourseButton cardId={cardId} />
      )}
      {!(isArchived || isEntitlement || certificate.isDownloadable) && (hasStarted
        ? <ResumeButton cardId={cardId} />
        : <BeginCourseButton cardId={cardId} />
      )}
      {certificate.isDownloadable && 
        <ViewCourseButton cardId={cardId} />
      }
      {shouldShowUnenrollItem && (
        <>
          <Button
            variant='tertiary'
            size='sm'
            style={{marginLeft: 1 + 'rem'}}
            className='unenroll'
            disabled={isMasquerading}
            onClick={unenrollModal.show}
          >
            {formatMessage(messages.unenroll)}
          </Button>
          <UnenrollConfirmModal
            show={unenrollModal.isVisible}
            closeModal={unenrollModal.hide}
            cardId={cardId}
          />
          {isEmailEnabled && (
            <EmailSettingsModal
              show={emailSettings.isVisible}
              closeModal={emailSettings.hide}
              cardId={cardId}
            />
          )}
        </>
      )}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
