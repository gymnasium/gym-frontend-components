import { ensureConfig, getConfig } from '@edx/frontend-platform';
ensureConfig(['MARKETING_SITE_BASE_URL']);
const config = getConfig();
console.log(`config:`, config);
const root = MARKETING_SITE_BASE_URL || 'http://edly.io:8888';

export default async function Settings() {
  try {
    let response = await fetch(`${root}/feeds/config.json`);
    let responseJson = await response.json();
    return responseJson;
   } catch(error) {
    console.error(error);
  }
}
