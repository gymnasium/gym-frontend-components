import React from 'react';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { AppContext } from '@edx/frontend-platform/react';

import { htmlDecode } from '../helpers';
import dompurify from 'dompurify';

ensureConfig(['GYM_FOOTER'], 'GymFooter');

const getFooter = () => getConfig().GYM_FOOTER;
const decodedFooter = () => htmlDecode(getFooter());

const EVENT_NAMES = {
  FOOTER_LINK: 'edx.bi.footer.link',
};

class GymFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute('href');
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: 'outbound_link',
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  render() {
    const {

    } = this.props;
    const { config } = this.context;
    const sanitizedFooter = { __html: dompurify.sanitize(decodedFooter()) };

    // The only unfortunate thing is that this means our <footer> element is wrapped in a <div>
    return <div dangerouslySetInnerHTML={ sanitizedFooter } />;
  }
}

GymFooter.contextType = AppContext;

GymFooter.propTypes = {

};

GymFooter.defaultProps = {

};

export default GymFooter;
export { EVENT_NAMES };
