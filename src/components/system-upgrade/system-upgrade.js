import { module } from 'angular';
import uiRouter from 'angular-ui-router';

export default module('app.components.system-upgrade', [uiRouter])
  .config(($stateProvider) => {
    'ngInject';

    $stateProvider.state({
      component: 'systemUpgrade',
      name: 'systemUpgrade',
      resolve: {
        connection: ['session', session => session.currentConnect.catch(() => false)],
      },
      url: '/system/upgrade',
    });
  })
  .component('systemUpgrade', {
    controller: class SystemUpgradeCtrl {
      constructor($q, $window, router) {
        'ngInject';

        this.$q = $q;
        this.$window = $window;
        this.router = router;
      }

      arrayBufferToBase64(buffer) {
        let base64 = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i += 1) {
          base64 += String.fromCharCode(bytes[i]);
        }
        return this.$window.btoa(base64);
      }

      upload(content) {
        this.uploading = true;
        this.error = undefined;

        const firmware = this.arrayBufferToBase64(content);

        this.router.upgradeFirmware(firmware).then(
          () => {
            this.uploaded = true;
            this.uploading = false;
          },
          (data) => {
            this.uploading = false;
            this.error = data.data;
          },
        );
      }
    },
    template: require('./system-upgrade.html'),
  });
