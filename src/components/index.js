import { module } from 'angular';

import authenticateModal from './authenticate-modal/authenticate-modal';
import connectModal from './connect-modal/connect-modal';
import home from './home/home';
import languageDropdown from './language-dropdown/language-dropdown';
import loadFileButton from './load-file-button/load-file-button';
import loadFileModal from './load-file-modal/load-file-modal';
import navbar from './navbar/navbar';
import wizard from './wizard/wizard';
import wizardLocation from './wizard-location/wizard-location';
import wizardRouter from './wizard-router/wizard-router';

export default module('app.components', [
  authenticateModal.name,
  connectModal.name,
  home.name,
  languageDropdown.name,
  loadFileButton.name,
  loadFileModal.name,
  navbar.name,
  wizard.name,
  wizardLocation.name,
  wizardRouter.name,
]);
