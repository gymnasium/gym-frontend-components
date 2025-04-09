import {
  getConfig,
} from '@edx/frontend-platform';
import { AppProvider } from '../';
import { PageWrap } from '@edx/frontend-platform/react';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import { fetchDiscussionTab, fetchLiveTab } from '@src/course-home/data/thunks';
import DiscussionTab from '@src/course-home/discussion-tab/DiscussionTab';

import { UserMessagesProvider } from '@src/generic/user-messages';

import OutlineTab from './course-home/outline-tab';
import { CourseExit } from './courseware/course/course-exit';
import CoursewareContainer from './courseware';
import CoursewareRedirectLandingPage from '@src/courseware/CoursewareRedirectLandingPage';
import DatesTab from '@src/course-home/dates-tab';
import GoalUnsubscribe from './course-home/goal-unsubscribe';
import ProgressTab from './course-home/progress-tab/ProgressTab';
import { TabContainer } from './tab-page';

import { fetchDatesTab, fetchOutlineTab, fetchProgressTab } from '@src/course-home/data';
import { fetchCourse } from '@src/courseware/data';
import initializeStore from '@src/store';
import NoticesProvider from '@src/generic/notices';
import PathFixesProvider from '@src/generic/path-fixes';
import LiveTab from '@src/course-home/live-tab/LiveTab';
import CourseAccessErrorPage from './generic/CourseAccessErrorPage';
import DecodePageRoute from '@src/decode-page-route';
import { DECODE_ROUTES, ROUTES } from '@src/constants';
import PreferencesUnsubscribe from '@src/preferences-unsubscribe';

import { GymFooter as FooterSlot } from '@openedx/gym-frontend';

import {Intercom, update } from "@intercom/messenger-js-sdk";

import './App.scss';

const INTERCOM_APP_ID = () => getConfig().INTERCOM_APP_ID;

export const App = () => {
  if (INTERCOM_APP_ID()) {
    try {
      Intercom({app_id: INTERCOM_APP_ID()});

      const INTERCOM_SETTINGS = {
        email: getAuthenticatedUser().email,
        user_id: getAuthenticatedUser().username,
      }
    
      update(INTERCOM_SETTINGS);
    } catch (error) {
      logError(error);
    }
  }
  return (
    <AppProvider store={initializeStore()}>
      <PathFixesProvider>
        <NoticesProvider>
          <UserMessagesProvider>
            <Routes>
              <Route path={ROUTES.UNSUBSCRIBE} element={<PageWrap><GoalUnsubscribe /></PageWrap>} />
              <Route path={ROUTES.REDIRECT} element={<PageWrap><CoursewareRedirectLandingPage /></PageWrap>} />
              <Route path={ROUTES.PREFERENCES_UNSUBSCRIBE} element={<PageWrap><PreferencesUnsubscribe /></PageWrap>} />
              <Route
                path={DECODE_ROUTES.ACCESS_DENIED}
                element={<DecodePageRoute><CourseAccessErrorPage /></DecodePageRoute>}
              />
              <Route
                path={DECODE_ROUTES.HOME}
                element={(
                  <DecodePageRoute>
                    <TabContainer tab="outline" fetch={fetchOutlineTab} slice="courseHome">
                      <OutlineTab />
                    </TabContainer>
                  </DecodePageRoute>
              )}
              />
              <Route
                path={DECODE_ROUTES.LIVE}
                element={(
                  <DecodePageRoute>
                    <TabContainer tab="lti_live" fetch={fetchLiveTab} slice="courseHome">
                      <LiveTab />
                    </TabContainer>
                  </DecodePageRoute>
                )}
              />
              <Route
                path={DECODE_ROUTES.DATES}
                element={(
                  <DecodePageRoute>
                    <TabContainer tab="dates" fetch={fetchDatesTab} slice="courseHome">
                      <DatesTab />
                    </TabContainer>
                  </DecodePageRoute>
                )}
              />
              <Route
                path={DECODE_ROUTES.DISCUSSION}
                element={(
                  <DecodePageRoute>
                    <TabContainer tab="discussion" fetch={fetchDiscussionTab} slice="courseHome">
                      <DiscussionTab />
                    </TabContainer>
                  </DecodePageRoute>
                )}
              />
              {DECODE_ROUTES.PROGRESS.map((route) => (
                <Route
                  key={route}
                  path={route}
                  element={(
                    <DecodePageRoute>
                      <TabContainer
                        tab="progress"
                        fetch={fetchProgressTab}
                        slice="courseHome"
                        isProgressTab
                      >
                        <ProgressTab />
                      </TabContainer>
                    </DecodePageRoute>
                  )}
                />
              ))}
              <Route
                path={DECODE_ROUTES.COURSE_END}
                element={(
                  <DecodePageRoute>
                    <TabContainer tab="courseware" fetch={fetchCourse} slice="courseware">
                      <CourseExit />
                    </TabContainer>
                  </DecodePageRoute>
                )}
              />
              {DECODE_ROUTES.COURSEWARE.map((route) => (
                <Route
                  key={route}
                  path={route}
                  element={(
                    <DecodePageRoute>
                      <CoursewareContainer />
                    </DecodePageRoute>
                  )}
                />
              ))}
            </Routes>
          </UserMessagesProvider>
        </NoticesProvider>
      </PathFixesProvider>
      <FooterSlot />
    </AppProvider>
  )
}

export default App;
