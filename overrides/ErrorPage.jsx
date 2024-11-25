import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Container
} from '@openedx/paragon';

import { GymErrors, GymFooter, GymHeader } from '/@openedx/gym-frontend';

import { useAppEvent } from '@edx/frontend-platform/react/hooks';
import {
  IntlProvider,
  getMessages,
  getLocale,
  LOCALE_CHANGED,
} from '@edx/frontend-platform/i18n';

/**
 * An error page that displays a generic message for unexpected errors.  Also contains a "Try
 * Again" button to refresh the page.
 *
 * @memberof module:React
 * @extends {Component}
 */
function ErrorPage({
  message,
}) {
  const [locale, setLocale] = useState(getLocale());

  useAppEvent(LOCALE_CHANGED, () => {
    setLocale(getLocale());
  });

  return (
    <IntlProvider locale={locale} messages={getMessages()}>
      <GymHeader/>
      <main>
        <Container fluid={false} data-testid="error-page">
          <GymErrors type="unknown" button="refresh" message={message} />
        </Container>
      </main>
      <GymFooter/>
    </IntlProvider>
  );
}

ErrorPage.propTypes = {
  message: PropTypes.string,
};

ErrorPage.defaultProps = {
  message: null,
};

export default ErrorPage;