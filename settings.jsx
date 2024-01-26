import { getConfig } from '@edx/frontend-platform';
const config = getConfig();

const root = config.MARKETING_SITE_BASE_URL;
console.log(`settings:`, config);

export default async function Settings() {
  try {
    let response = await fetch(`${root}/feeds/config.json`);
    let responseJson = await response.json();
    return responseJson;
   } catch(error) {
    console.error(error);
  }
}