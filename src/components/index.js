import { module } from 'angular';

import languageDropdown from './language-dropdown/language-dropdown';
import navbar from './navbar/navbar';
import routerLocation from './router-location/router-location';
import wizard from './wizard/wizard';

export default module('app.components', [
  languageDropdown.name,
  navbar.name,
  routerLocation.name,
  wizard.name,
]);
