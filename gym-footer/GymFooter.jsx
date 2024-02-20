import React from 'react';
import PropTypes from 'prop-types';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { ensureConfig } from '@edx/frontend-platform/config';
import { AppContext } from '@edx/frontend-platform/react';

import GymSettings from '../settings';
const settings = await GymSettings();

console.log(`settings: `, settings);

const GYM_FOOTER_NAV_LINKS = settings?.footer.nav;
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

      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <div className="main">
            <div className="header">
              <a href={settings?.urls?.root} aria-label={ settings?.meta?.title + ' homepage'}>
                <img alt={settings?.meta?.author} src={ settings?.urls?.data + settings?.logos?.main?.white?.src } srcSet={ settings?.urls?.data + settings?.logos?.main?.white?.srcset } decoding="async" fetchpriority="low" width="208" height="24" />
              </a>
              <p>{settings?.meta?.short_description}</p>
            </div>

            {GYM_FOOTER_NAV_LINKS && (
              GYM_FOOTER_NAV_LINKS.map((item, index) => {
              const slug = slugify(item['title']);
              return <nav 
                id={slug}
                aria-labelledby={slug + '-menu-label'}
                className="footer-section"
                key={index}
                >
                  <h2 id={slug + '-menu-label'}>{item['title']}</h2>
                  <ul>
                    {item['links'].map((link, i) => {
                      return (
                        <li key={i}><a href={link.href} rel={link.rel} target={link.target}>{link.label}</a></li>
                      )
                    })}
                  </ul>
                </nav>
              })
            )}

          </div>
        
          {/* TODO prepopulate this stuff in the JSON */}
          <aside className="stack" aria-label="Built with">
            <a href="https://openedx.org" target="_blank" rel="noopener">
              <img className="openedx-logo" alt={ settings?.logos.openedx.alt } src={ settings?.urls.data + settings?.logos.openedx.src } decoding="async" fetchpriority="low" width="175" height="70" />
            </a>
            
            <a href="https://docs.tutor.overhang.io" target="_blank" rel="noopener">
              <img className="tutor-logo" alt={ settings?.logos.tutor.alt } src={ settings?.urls.data + settings?.logos.tutor.src } decoding="async" fetchpriority="low" width="125" height="24" />
            </a>
          </aside>

          <p className="copyright">
            <small>© {currentYear} <a href={settings?.urls?.root} aria-label={ settings?.meta?.title + ' homepage'}>{settings?.meta?.author}</a>
            </small>
          </p>
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