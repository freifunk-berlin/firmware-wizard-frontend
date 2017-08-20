import { copy, module } from 'angular';

export default module('app.components.wizard-internet', [])
  .component('wizardInternet', {
    bindings: {
      internet: '<',
      onUpdate: '&',
    },
    // TODO: handle vpn
    controller: class WizardContactCtrl {

      constructor($scope) {
        'ngInject';

        this.newInternet = {};
        this.internetTunnelEnabled = false;
        this.internetTunnelConf = [
          {
            fileExtensions: '.ovpn,.cnf,text/*',
            property: 'config',
            tunnelType: 'internettunnel',
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
            property: 'takey',
          },
        ];

        this.internetTunnelConfSecret = [
          {
            fileExtensions: '*',
            property: 'auth-user-pass',
          },
          {
            fileExtensions: '*',
            property: 'secret',
          },
        ];

        $scope.$watch('$ctrl.internet', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newInternet', this.updateOutput.bind(this), true);
      }

      updateFromInput(internet) {
        this.internetTunnelEnabled = false;
        copy(internet, this.newInternet);
        if (internet && internet.internetTunnel) {
          this.internetTunnelEnabled = true;
        }
      }

      setTunnelType(type) {
        if (!this.newInternet.internetTunnel) {
          this.newInternet.internetTunnel = {};
        }
        this.newInternet.internetTunnel.type = type;
      }

      updateOutput(newInternet) {
        let internet = copy(newInternet);
        if (!internet.share) {
          internet = {};
        }
        if (!internet.speedLimit) {
          delete internet.speedLimit;
          delete internet.speedLimitDown;
          delete internet.speedLimitUp;
        }
        if (!internet.tunnel || !this.internetTunnelEnabled) {
          delete internet.tunnel;
        }
        this.onUpdate({internet});
      }
    },
    template: require('./wizard-internet.html'),
  });
