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
        this.meshTunnelEnabled = false;
        this.internetTunnelConf = [
          {
            fileExtensions: '.ovpn,.cnf,text/*',
            property: 'config',
            tunnelType: 'internettunnel',
            required: true,
          },
          {
            fileExtensions: '.crt,text/*',
            tunnelType: 'internettunnel',
            property: 'cert',
          },
          {
            fileExtensions: '.crt,text/*',
            tunnelType: 'internettunnel',
            property: 'cacert',
          },
          {
            fileExtensions: '.key,text/*',
            tunnelType: 'internettunnel',
            property: 'key',
          },
          {
            fileExtensions: '.key,text/*',
            tunnelType: 'internettunnel',
            property: 'takey',
          },
        ];

        this.internetTunnelConfSecret = [
          {
            fileExtensions: '*',
            tunnelType: 'internettunnel',
            property: 'auth-user-pass',
          },
          {
            fileExtensions: '*',
            tunnelType: 'internettunnel',
            property: 'secret',
          },
        ];

        this.meshTunnelConf = [
          {
            fileExtensions: '.ovpn,.cnf,text/*',
            property: 'config',
            tunnelType: 'meshTunnel',
            required: true,
          },
          {
            fileExtensions: '.crt,text/*',
            tunnelType: 'meshTunnel',
            property: 'cert',
          },
          {
            fileExtensions: '.crt,text/*',
            tunnelType: 'meshTunnel',
            property: 'cacert',
          },
          {
            fileExtensions: '.key,text/*',
            tunnelType: 'meshTunnel',
            property: 'key',
          },
          {
            fileExtensions: '.key,text/*',
            tunnelType: 'meshTunnel',
            property: 'takey',
          },
        ];

        $scope.$watch('$ctrl.internet', this.updateFromInput.bind(this), true);
        $scope.$watch('$ctrl.newInternet', this.updateOutput.bind(this), true);
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
