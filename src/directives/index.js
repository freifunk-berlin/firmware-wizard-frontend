import { module } from 'angular';

import compareTo from './compare-to';
import fileRequired from './file-required';
import ipAddress from './ip-address';
import sshKey from './ssh-key';

export default module('app.directives', [
  compareTo.name,
  fileRequired.name,
  ipAddress.name,
  sshKey.name,
]);
