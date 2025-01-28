import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import { AppContext } from '@edx/frontend-platform/react';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from '@src/data/constants/requests';
import store from '@src/data/store';
import {
  selectors,
  actions,
} from '@src/data/redux';
import { reduxHooks } from '@src/hooks';
import Dashboard from './containers/Dashboard';

import track from '@src/tracking';

import fakeData from '@src/data/services/lms/fakeData/courses';

import AppWrapper from '@src/containers/WidgetContainers/AppWrapper';

import { getConfig } from '@edx/frontend-platform';

import { ErrorPage, GymFooter as FooterSlot, GymHeader } from '@openedx/gym-frontend';

import messages from '@src/messages';
import './App.scss';

import { Intercom, update } from "@intercom/messenger-js-sdk";

const INTERCOM_APP_ID = () => getConfig().INTERCOM_APP_ID;

export const App = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  if (INTERCOM_APP_ID()) {
    try {
      Intercom({app_id: INTERCOM_APP_ID()});

      const INTERCOM_SETTINGS = {
        email: authenticatedUser?.email,
        name: authenticatedUser?.name,
        user_id: authenticatedUser?.username,
      }
    
      update(INTERCOM_SETTINGS);
    } catch (error) {
      logError(error);
    }
  }

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
      </Helmet>
      <AppWrapper>
        <GymHeader secondaryNav="dashboard" activeLink="dashboard" />
        <main>
          {hasNetworkFailure
            ? (
              <Alert variant="danger">
                <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
              </Alert>
            ) : (
              <Dashboard />
            )}
        </main>
      </AppWrapper>
      <FooterSlot />
    </>
  );
};

export default App;
