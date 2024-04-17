import GymFooter from './gym-footer/GymFooter';
import GymHeader from './gym-header/GymHeader';
import { htmlDecode, slugify, timestamp } from './helpers';
import Settings from './settings';

const GymSettings = await Settings();

export { GymFooter, GymHeader, GymSettings, htmlDecode, slugify, timestamp };
