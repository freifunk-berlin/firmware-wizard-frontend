import { module } from 'angular';

import authenticateModal from './authenticate-modal/authenticate-modal';
import connectModal from './connect-modal/connect-modal';
import home from './home/home';
import languageDropdown from './language-dropdown/language-dropdown';
import loadFileButton from './load-file-button/load-file-button';
import navbar from './navbar/navbar';
import statusOlsr from './status-olsr/status-olsr';
import statusSystem from './status-system/status-system';
import wizard from './wizard/wizard';
import wizardContact from './wizard-contact/wizard-contact';
import wizardDevice from './wizard-device/wizard-device';
import wizardInternet from './wizard-internet/wizard-internet';
import wizardIp from './wizard-ip/wizard-ip';
import wizardLocation from './wizard-location/wizard-location';
import wizardMonitoring from './wizard-monitoring/wizard-monitoring';
import wizardRouter from './wizard-router/wizard-router';
import wizardTunnel from './wizard-tunnel/wizard-tunnel';
import loadFileForm from './load-file-form/load-file-form';

export default module('app.components', [
  authenticateModal.name,
  connectModal.name,
  home.name,
  languageDropdown.name,
  loadFileButton.name,
  navbar.name,
  statusOlsr.name,
  statusSystem.name,
  wizard.name,
  wizardContact.name,
  wizardDevice.name,
  wizardInternet.name,
  wizardIp.name,
  wizardLocation.name,
  wizardMonitoring.name,
  wizardRouter.name,
  wizardTunnel.name,
  loadFileForm.name,
]);
