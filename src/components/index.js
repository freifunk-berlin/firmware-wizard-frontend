import { module } from 'angular';

import authenticateModal from './authenticate-modal/authenticate-modal';
import connectModal from './connect-modal/connect-modal';
import home from './home/home';
import languageDropdown from './language-dropdown/language-dropdown';
import navbar from './navbar/navbar';
import routerLocation from './router-location/router-location';
import wizard from './wizard/wizard';
import wizardRouter from './wizard-router/wizard-router';

export default module('app.components', [
  authenticateModal.name,
  connectModal.name,
  home.name,
  languageDropdown.name,
  navbar.name,
  routerLocation.name,
  wizard.name,
  wizardRouter.name,
]);
