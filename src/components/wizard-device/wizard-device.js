import { copy, module } from 'angular';

export default module('app.components.wizard-device', [])
  .component('wizardDevice', {
    bindings: {
      onUpdate: '&',
    },
    controller: class WizardDeviceCtrl {
      constructor($filter, $scope, router, session) {
        'ngInject';

        this.$filter = $filter;
        this.router = router;
        this.session = session;

        this.newDevice = {};

        $scope.$watch('$ctrl.session.connection', this.updateFromSession.bind(this), true);
        $scope.$watch('$ctrl.newDevice', this.updateOutput.bind(this), true);

        this.devices = devices;
      }

      getDeviceInfo() {
        const device = {model: this.session.connection.board.model};
        // get wireless interfaces
        return this.router.getNetworkWireless()
          .then(data => {
            device.wirelessDevices = this.$filter('objectLength')(data);
            return device;
          });
      }

      updateFromSession(connection) {
        if (connection) {
          // wait for current connect to finish
          return this.session.currentConnect
            .then(() => this.getDeviceInfo())
            .then(device => this.newDevice = device);
        } else {
          this.newDevice = {};
        }
      }

      updateOutput(newDevice) {
        let device = copy(newDevice);
        this.onUpdate({device});
      }
    },
    template: require('./wizard-device.html'),
  });

const devices = [
  {
    model: 'TP-Link TL-WDR3600 v1',
    wirelessDevices: 2,
  },
  {
    model: 'TP-Link TL-WR741 v1',
    wirelessDevices: 1,
  },
];
