import React from 'react';
import PropTypes from 'prop-types';
import {
  Container
} from '@openedx/paragon';

import { GymErrors, GymFooter, GymHeader } from '@openedx/gym-frontend';

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

  return (
    <>
      <GymHeader />
      <main>
        <Container fluid={false} data-testid="error-page">
          <GymErrors type="unknown" button="refresh" message={message} />
        </Container>
      </main>
      <GymFooter />
    </>
  );
}

ErrorPage.propTypes = {
  message: PropTypes.string,
};

ErrorPage.defaultProps = {
  message: null,
};

export { ErrorPage };
export default ErrorPage;