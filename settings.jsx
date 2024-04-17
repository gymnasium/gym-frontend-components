import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig(['MARKETING_SITE_BASE_URL'],'Settings()');

const config = () => getConfig();
console.log(`config:`, config());

const getBaseUrl = () => getConfig().MARKETING_SITE_BASE_URL;

export default async function Settings() {
  try {
    let response = await fetch(`${getBaseUrl()}/feeds/config.json`);
    let responseJson = response.json();
    return responseJson;
   } catch(error) {
    console.error(`there was an error fetching settings from ${getBaseUrl()}`, error);
  }
}
