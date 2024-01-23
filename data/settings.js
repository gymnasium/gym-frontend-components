import { getConfig } from '@edx/frontend-platform';
const config = getConfig();
const root = config.MARKETING_SITE_BASE_URL;

export default async function GymSettings() {
  try {
    let response = await fetch(`http://gym.soy/feeds/config.json`);
    // let response = await fetch(`https://gym.soy/feeds/config.json`);
    let responseJson = await response.json();
    return responseJson;
   } catch(error) {
    console.error(error);
  }
}
