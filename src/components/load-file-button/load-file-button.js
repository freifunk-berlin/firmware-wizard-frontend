import { module } from 'angular';

require('./load-file-button.less');

export default module('app.components.load-file-button', [])
  .component('loadFileButton', {
    bindings: {
      accept: '@',
      disabled: '<',
      type: '@',
      onDismiss: '&',
      onLoaded: '&',
    },
    controller: class LoadFileButtonCtrl {
      constructor($element, $scope, $window) {
        'ngInject';

        this.$scope = $scope;
        this.$window = $window;
        $element.on('change', this.load.bind(this));
      }

      load(event) {
        if (!event.target.files || event.target.files.length === 0) return;
        const reader = new this.$window.FileReader();
        reader.onload = frEvent => this.$scope.$apply(() => {
          this.onLoaded({content: frEvent.target.result});
        });
        const file = event.target.files[0];
        switch (this.type) {
          case 'binary':
            reader.readAsArrayBuffer(file);
            break;
          case 'text':
            reader.readAsText(file);
            break;
          default: throw new Error(`type ${this.type} not recognized`);
        }
      }
    },
    template: require('./load-file-button.html'),
    transclude: true,
  });
