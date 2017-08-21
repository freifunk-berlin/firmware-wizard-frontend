import { copy, module } from 'angular';

export default module('app.components.wizard-internet', [])
  .component('wizardInternet', {
    bindings: {
      internet: '<',
      onUpdate: '&',
    },
    controller: class WizardContactCtrl {

      constructor($scope) {
        'ngInject';

        this.newInternet = {};
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
            property: 'takey',
          },
        ];

        this.tunnelConfSecret = [
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

      toggleVpnList() {
        this.showVpnList = !this.showVpnList;
      }

      setTunnelType(type) {
        if (!this.newInternet.internetTunnel) {
          this.newInternet.internetTunnel = {};
        }
        this.newInternet.internetTunnel.type = type;
      }

      setMeshTunnelType(type) {
        if (!this.newInternet.meshTunnel) {
          this.newInternet.meshTunnel = {};
        }
        this.newInternet.meshTunnel.type = type;
      }

      clearFiles() {
        if (this.newInternet.internetTunnel && this.newInternet.internetTunnel.files) {
          delete this.newInternet.internetTunnel.files;
        }
      }

      clearMeshTunnelFiles() {
        if (this.newInternet.meshTunnel && this.newInternet.meshTunnel.files) {
          delete this.newInternet.meshTunnel.files;
        }
      }

      updateFromInput(internet) {
        this.internetTunnelEnabled = false;
        this.meshTunnelEnabled = false;
        copy(internet, this.newInternet);
        if (internet && internet.internetTunnel) {
          this.internetTunnelEnabled = true;
        }
        if (internet && internet.meshTunnel) {
          this.meshTunnelEnabled = true;
        }
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
        if (!internet.internetTunnel || !this.internetTunnelEnabled) {
          delete internet.internetTunnel;
        }
        if (!internet.meshTunnel || !this.meshTunnelEnabled) {
          delete internet.meshTunnel;
        }
        this.onUpdate({internet});
      }
    },
    template: require('./wizard-internet.html'),
  });
