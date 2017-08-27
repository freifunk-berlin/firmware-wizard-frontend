import { copy, module } from 'angular';
import { clone } from 'lodash';

export default module('app.components.wizard-tunnel', [])
  .component('wizardTunnel', {
    bindings: {
      tunnel: '<',
      onUpdate: '&',
    },
    controller: class WizardTunnelCtrl {
      constructor($scope) {
        'ngInject';

        this.files = {};

        this.tunnelConf = [
          {
            fileExtensions: '.ovpn,.cnf,text/*',
            property: 'config',
            required: true,
          },
          {
            fileExtensions: '.crt,text/*',
            property: 'cert',
          },
          {
            fileExtensions: '.crt,text/*',
            property: 'cacert',
          },
          {
            fileExtensions: '.key,text/*',
            property: 'key',
          },
          {
            fileExtensions: '.key,text/*',
            property: 'tls-auth',
          },
          {
            fileExtensions: '*',
            property: 'auth-user-pass',
          },
          {
            fileExtensions: '*',
            property: 'secret',
          },
        ];

        $scope.$watch('$ctrl.tunnel', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.type', this.updateOutput.bind(this));
        $scope.$watchCollection('$ctrl.files', this.updateOutput.bind(this));
      }

      updateFromInput() {
        const tunnel = this.tunnel || {};

        this.type = tunnel.type || 'openvpn';
        copy(tunnel.files || {}, this.files);
      }

      updateOutput() {
        const tunnel = {type: this.type, files: clone(this.files)};
        this.onUpdate({tunnel});
      }
    },
    template: require('./wizard-tunnel.html'),
  });
