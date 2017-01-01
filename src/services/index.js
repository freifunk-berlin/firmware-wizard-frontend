import { module } from 'angular';

import downloadFile from './download-file';
import jsonrpc from './jsonrpc';
import online from './online';
import router from './router';
import session from './session';

export default module('app.services', [
  downloadFile.name,
  jsonrpc.name,
  online.name,
  router.name,
  session.name,
]);
