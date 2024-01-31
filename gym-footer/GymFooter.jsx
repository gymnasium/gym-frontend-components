import React from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform/config';
import { AppContext } from '@edx/frontend-platform/react';

import GymSettings from '../settings';
const settings = await GymSettings();

console.log(`settings: `, settings);

const GYM_FOOTER_NAV_LINKS = settings.navigation.footer;
const currentYear = new Date().getFullYear();

// Shamelessly borrowed from @https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n#comment-2689a
function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  str = str.toLowerCase(); // convert to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
  .replace(/\s+/g, '-') // collapse whitespace and replace by "-"
  .replace(/-+/g, '-'); // collapse dashes
  return str;
}

ensureConfig([
  'LMS_BASE_URL',
  'LOGO_TRADEMARK_URL',
], 'Footer component');

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
      logo,
    } = this.props;
    const { config } = this.context;

    return (

      <footer id="footer" className="site-footer">
        <div className="container">
          <nav aria-label="Footer Navigation">

          {GYM_FOOTER_NAV_LINKS && (
            GYM_FOOTER_NAV_LINKS.map((item, index) => {
            const slug = slugify(item['title']);
            return <div 
              id={slug}
              className="footer-section"
              key={index}
              >
                <h4>{item['title']}</h4>
                <ul>
                  {item['links'].map((link, i) => {
                    return (
                      <li key={i}><a href={link.href} rel={link.rel} target={link.target}>{link.title}</a></li>
                    )
                  })}
                </ul>
              </div>
            })
          )}
          </nav>
          <div className="copyright"><small>© {currentYear} <a href={settings.urls.root}>{settings.meta.author}</a></small></div>
        </div>
      </footer>

    );
  }
}

GymFooter.contextType = AppContext;

GymFooter.propTypes = {
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

GymFooter.defaultProps = {
  logo: undefined,
};

export default GymFooter;
export { EVENT_NAMES };