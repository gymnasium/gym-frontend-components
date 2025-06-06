import React, { Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import PageLoading from '@src/generic/PageLoading';
import { useModel } from '@src/generic/model-store';

import messages from '@src/courseware/course/sequence/messages';
import Unit from './Unit';

const ContentLock = React.lazy(() => import('@src/courseware/course/sequence/content-lock'));

const SequenceContent = ({
  gated,
  intl,
  courseId,
  sequenceId,
  unitId,
  unitLoadedHandler,
}) => {
  const sequence = useModel('sequences', sequenceId);

  // Go back to the top of the page whenever the unit or sequence changes.
  useEffect(() => {
    global.scrollTo(0, 0);
  }, [sequenceId, unitId]);

  if (gated) {
    return (
      <Suspense
        fallback={(
          <PageLoading
            srMessage={intl.formatMessage(messages.loadingLockedContent)}
          />
        )}
      >
        <ContentLock
          courseId={courseId}
          sequenceTitle={sequence.title}
          prereqSectionName={sequence.gatedContent.prereqSectionName}
          prereqId={sequence.gatedContent.prereqId}
        />
      </Suspense>
    );
  }

  const unit = useModel('units', unitId);
  if (!unitId || !unit) {
    return (
      <div>
        {intl.formatMessage(messages.noContent)}
      </div>
    );
  }

  return (
    <Unit
      courseId={courseId}
      format={sequence.format}
      key={unitId}
      id={unitId}
      onLoaded={unitLoadedHandler}
    />
  );
};

SequenceContent.propTypes = {
  gated: PropTypes.bool.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  unitId: PropTypes.string,
  unitLoadedHandler: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

SequenceContent.defaultProps = {
  unitId: null,
};

export default injectIntl(SequenceContent);