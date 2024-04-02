import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['MARKETING_SITE_BASE_URL'],'Settings()');

const config = getConfig();
console.log(`config:`, config);

// Fallback logic
let root;
if (!!config.MARKETING_SITE_BASE_URL) {
  root = config.MARKETING_SITE_BASE_URL;
} else if (!!process.env.MARKETING_SITE_BASE_URL) {
  root = process.env.MARKETING_SITE_BASE_URL;
} else {
  // probably want to avoid hard-coding this, but this is here as a failsafe just in case all of the above fails.
  root = 'http://edly.io:8888';
}

console.log(
  `root: `, root,
  `config.MARKETING_SITE_BASE_URL: `, config.MARKETING_SITE_BASE_URL,
  `process.env.MARKETING_SITE_BASE_URL: `, process.env.MARKETING_SITE_BASE_URL
);

export default async function Settings() {
  try {
    let response = await fetch(`http://edly.io:8888/feeds/config.json`);
    let responseJson = await response.json();
    return responseJson;
   } catch(error) {
    console.error(error);
  }
}
