import {copy, module} from 'angular';

export default module('app.components.load-file-form', [])
  .component('loadFileForm', {
    bindings: {
      details: '<',
      onUpdate: '&',
      fileContent: '<',
      idPrefix: '@',
    },
    controller: class WizardTunnelCtrl {
      constructor($scope) {
        'ngInject';

        $scope.$watch('$ctrl.fileContent', this.update.bind(this));
      }

      update() {
        this.onUpdate({fileContent: this.fileContent});
      }
    },
    template: require('./load-file-form.html'),
    transclude: true,
  });
