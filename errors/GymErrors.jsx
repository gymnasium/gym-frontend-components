import React from 'react';
import PropTypes from 'prop-types';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { htmlDecode } from '../helpers';
import dompurify from 'dompurify';
import {
  Button, Container
} from '@openedx/paragon';
import { Refresh } from '@openedx/paragon/icons';

import {
  FormattedMessage,
  IntlProvider,
  getMessages,
  getLocale,
  LOCALE_CHANGED,
} from '@edx/frontend-platform/i18n';

ensureConfig(['GYM_MSG'], 'GymErrors');

const errorMsg = () => getConfig().GYM_MSG['errors'];

/* istanbul ignore next */
const reload = () => {
  global.location.reload();
};

const GymErrors = ({
  message,
  showButton,
  type,
  button
}) => {
  const heading = { __html: dompurify.sanitize(errorMsg()[`error_${type}`]?.heading) || '' }
  const description = { __html: dompurify.sanitize(errorMsg()[`error_${type}`]?.description) || '' }
  const body = { __html: dompurify.sanitize(errorMsg()[`error_${type}`]?.body) || '' }
  const links = errorMsg()?.links || null;
  const footer_text = { __html: dompurify.sanitize(errorMsg()[`error_${type}`]?.footer || errorMsg()?.footer) }
  const show_links = errorMsg()[`error_${type}`]?.show_links;
  return (
    <div className="main-panel">
      <article>
        {heading && (
          <h1 dangerouslySetInnerHTML={ heading } />
        )}
        {description && (
          <p dangerouslySetInnerHTML={ description } />
        )}
        {body && (
          <div dangerouslySetInnerHTML={ body } />
        )}

        {button && (
          <p>
            <Button 
            onClick={reload}
            iconBefore={Refresh}
            variant="primary"
            size="sm"
            >
            <FormattedMessage
              id="unexpected.error.button.text"
              defaultMessage="Try again"
              description="text for button that tries to reload the app by refreshing the page"
            />
            </Button>
          </p>
        )}
        {show_links && links && (
          <ul>
            {links.map((item, index) => {
              return (
                <li key={`links-${index}`}><a href={item.url}>{item.label}</a></li>
              )
            })}
          </ul>
        )}
        {footer_text && (
          <footer dangerouslySetInnerHTML={ footer_text } />
        )}
      </article>
    </div>
  )
};

GymErrors.propTypes = {
  type: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  links: PropTypes.string,
};

GymErrors.defaultProps = {
  type: '',
  heading: '',
  description: '',
  links: '',
};

export default GymErrors;
