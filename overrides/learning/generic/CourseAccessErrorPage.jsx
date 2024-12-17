import React, { useEffect } from 'react';
import { GymHeader as Header } from '@openedx/gym-frontend';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
// import FooterSlot from '@openedx/frontend-slot-footer';
import useActiveEnterpriseAlert from '@src/alerts/active-enteprise-alert';
import { AlertList } from '@src/generic/user-messages';
import { fetchDiscussionTab } from '@src/course-home/data/thunks';
import { LOADED, LOADING } from '@src/course-home/data/slice';
import PageLoading from '@src/generic/PageLoading';
import messages from '@src/tab-page/messages';

const CourseAccessErrorPage = ({ intl }) => {
  const { courseId } = useParams();

  const dispatch = useDispatch();
  const activeEnterpriseAlert = useActiveEnterpriseAlert(courseId);
  useEffect(() => {
    dispatch(fetchDiscussionTab(courseId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const {
    courseStatus,
  } = useSelector(state => state.courseHome);

  if (courseStatus === LOADING) {
    return (
      <>
        <Header secondaryNav="courses" activeLink="courses" />
        <PageLoading
          srMessage={intl.formatMessage(messages.loading)}
        />
      </>
    );
  }
  if (courseStatus === LOADED) {
    return <Navigate to={`/redirect/home/${courseId}`} replace />;
  }
  return (
    <>
      <Header secondaryNav="courses" activeLink="courses" />
      <main id="main-content" className="container my-5 text-center" data-testid="access-denied-main">
        <AlertList
          topic="outline"
          className="mx-5 mt-3"
          customAlerts={{
            ...activeEnterpriseAlert,
          }}
        />
      </main>
    </>
  );
};

CourseAccessErrorPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CourseAccessErrorPage);
