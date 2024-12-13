import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { AlertList } from '@src/generic/user-messages';

import CourseDates from '@src/course-home/outline-tab/widgets/CourseDates';
import CourseHandouts from './widgets/CourseHandouts';
import StartOrResumeCourseCard from './widgets/StartOrResumeCourseCard';
import WeeklyLearningGoalCard from './widgets/WeeklyLearningGoalCard';
import CourseTools from '@src/course-home/outline-tab/widgets/CourseTools';
import { fetchOutlineTab } from '@src/course-home/data';
import messages from '@src/course-home/outline-tab/messages';
import Section from './Section';
import ShiftDatesAlert from '@src/course-home/suggested-schedule-messaging/ShiftDatesAlert';
import UpgradeNotification from '@src/generic/upgrade-notification/UpgradeNotification';
import UpgradeToShiftDatesAlert from '@src/course-home/suggested-schedule-messaging/UpgradeToShiftDatesAlert';
import useCertificateAvailableAlert from './alerts/certificate-status-alert';
import useCourseEndAlert from '@src/course-home/outline-tab/alerts/course-end-alert';
import useCourseStartAlert from '@src/alerts/course-start-alert';
import usePrivateCourseAlert from './alerts/private-course-alert';
import useScheduledContentAlert from '@src/course-home/outline-tab/alerts/scheduled-content-alert';
import { useModel } from '@src/generic/model-store';
import WelcomeMessage from './widgets/WelcomeMessage';
import ProctoringInfoPanel from '@src/course-home/outline-tab/widgets/ProctoringInfoPanel';
import AccountActivationAlert from '@src/alerts/logistration-alert/AccountActivationAlert';

const OutlineTab = ({ intl }) => {
  const {
    courseId,
    proctoringPanelStatus,
  } = useSelector(state => state.courseHome);

  const {
    isSelfPaced,
    org,
    title,
    userTimezone,
  } = useModel('courseHomeMeta', courseId);

  const {
    accessExpiration,
    courseBlocks: {
      courses,
      sections,
    },
    courseGoals: {
      selectedGoal,
      weeklyLearningGoalEnabled,
    } = {},
    datesBannerInfo,
    datesWidget: {
      courseDateBlocks,
    },
    enableProctoredExams,
    offer,
    timeOffsetMillis,
    verifiedMode,
  } = useModel('outline', courseId);

  const {
    marketingUrl,
  } = useModel('coursewareMeta', courseId);

  const [expandAll, setExpandAll] = useState(false);
  const navigate = useNavigate();

  const eventProperties = {
    org_key: org,
    courserun_key: courseId,
  };

  // Below the course title alerts (appearing in the order listed here)
  const courseStartAlert = useCourseStartAlert(courseId);
  const courseEndAlert = useCourseEndAlert(courseId);
  const certificateAvailableAlert = useCertificateAvailableAlert(courseId);
  const privateCourseAlert = usePrivateCourseAlert(courseId);
  const scheduledContentAlert = useScheduledContentAlert(courseId);

  const rootCourseId = courses && Object.keys(courses)[0];

  const hasDeadlines = courseDateBlocks && courseDateBlocks.some(x => x.dateType === 'assignment-due-date');

  const logUpgradeToShiftDatesLinkClick = () => {
    sendTrackEvent('edx.bi.ecommerce.upsell_links_clicked', {
      ...eventProperties,
      linkCategory: 'personalized_learner_schedules',
      linkName: 'course_home_upgrade_shift_dates',
      linkType: 'button',
      pageName: 'course_home',
    });
  };

  const isEnterpriseUser = () => {
    const authenticatedUser = getAuthenticatedUser();
    const userRoleNames = authenticatedUser ? authenticatedUser.roles.map(role => role.split(':')[0]) : [];

    return userRoleNames.includes('enterprise_learner');
  };

  /** show post enrolment survey to only B2C learners */
  const learnerType = isEnterpriseUser() ? 'enterprise_learner' : 'b2c_learner';

  const location = useLocation();

  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const startCourse = currentParams.get('start_course');
    if (startCourse === '1') {
      sendTrackEvent('enrollment.email.clicked.startcourse', {});

      // Deleting the course_start query param as it only needs to be set once
      // whenever passed in query params.
      currentParams.delete('start_course');
      navigate({
        pathname: location.pathname,
        search: `?${currentParams.toString()}`,
        replace: true,
      });
    }
  }, [location.search]);

  const {
    resumeCourse: {
      hasVisitedCourse,
    },
  } = useModel('outline', courseId);

  let sectionOpen;

  function openIndex(ident, index) {
    const sectionCount = courses[ident].sectionIds.length;
    if (sectionCount <= 2) {
      sectionOpen = index <= sectionCount - 1 ? true : false;
    } else {
      sectionOpen = index === 0 ? true : false;
    }
    return sectionOpen;
  }

  return (
    <>
      <div data-learner-type={learnerType} className="row w-100 mx-0 my-3 justify-content-between">
        <div className="col-12 col-sm-auto p-0">
          <div role="heading" aria-level="1" className="h2">{title}</div>
        </div>
      </div>
      <div className="row course-outline-tab">
        <AccountActivationAlert />
        <div className="col-12">
          <AlertList
            topic="outline-private-alerts"
            customAlerts={{
              ...privateCourseAlert,
            }}
          />
        </div>
        <div className="col col-12 col-md-8">
          <AlertList
            topic="outline-course-alerts"
            className="mb-3"
            customAlerts={{
              ...certificateAvailableAlert,
              ...courseEndAlert,
              ...courseStartAlert,
              ...scheduledContentAlert,
            }}
          />
          {isSelfPaced && hasDeadlines && (
            <>
              <ShiftDatesAlert model="outline" fetch={fetchOutlineTab} />
              <UpgradeToShiftDatesAlert model="outline" logUpgradeLinkClick={logUpgradeToShiftDatesLinkClick} />
            </>
          )}
          <StartOrResumeCourseCard />
          <WelcomeMessage courseId={courseId} />
          {rootCourseId && (
            <>
              {/* Disable expand/contract button */}
              {/* <div className="expand-collapse-button-wrapper row w-100 m-0 mb-3 justify-content-end">
                <div className="col-12 col-md-auto p-0">
                  <Button variant="outline-primary" block onClick={() => { setExpandAll(!expandAll); }}>
                    {expandAll ? intl.formatMessage(messages.collapseAll) : intl.formatMessage(messages.expandAll)}
                  </Button>
                </div>
              </div> */}
              <ol id="courseHome-outline" className="list-unstyled">
                {courses[rootCourseId].sectionIds.map((sectionId, index) => (
                  // there's probably a more elegant way of doing this... for first time visitors who haven't started the course, forces the first section open for full courses, and all sections open for short courses with only two or less sections.
                  !hasVisitedCourse
                    ? openIndex(rootCourseId, index)
                    : (sectionOpen = sections[sectionId].resumeBlock),
                  <Section
                    key={sectionId}
                    courseId={courseId}
                    defaultOpen={sectionOpen}
                    expand={expandAll}
                    section={sections[sectionId]}
                  />
                ))}
              </ol>
            </>
          )}
        </div>
        {rootCourseId && (
          <div className="col col-12 col-md-4">
            <ProctoringInfoPanel />
            { /** Defer showing the goal widget until the ProctoringInfoPanel has resolved or has been determined as
             disabled to avoid components bouncing around too much as screen is rendered */ }
            {(!enableProctoredExams || proctoringPanelStatus === 'loaded') && weeklyLearningGoalEnabled && (
              <WeeklyLearningGoalCard
                daysPerWeek={selectedGoal && 'daysPerWeek' in selectedGoal ? selectedGoal.daysPerWeek : null}
                subscribedToReminders={selectedGoal && 'subscribedToReminders' in selectedGoal ? selectedGoal.subscribedToReminders : false}
              />
            )}
            <CourseTools />
            <PluginSlot
              id="outline_tab_notifications_slot"
              pluginProps={{
                courseId,
                model: 'outline',
              }}
            >
              <UpgradeNotification
                offer={offer}
                verifiedMode={verifiedMode}
                accessExpiration={accessExpiration}
                contentTypeGatingEnabled={datesBannerInfo.contentTypeGatingEnabled}
                marketingUrl={marketingUrl}
                upsellPageName="course_home"
                userTimezone={userTimezone}
                shouldDisplayBorder
                timeOffsetMillis={timeOffsetMillis}
                courseId={courseId}
                org={org}
              />
            </PluginSlot>
            <CourseDates />
            <CourseHandouts />
          </div>
        )}
      </div>
    </>
  );
};

OutlineTab.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(OutlineTab);