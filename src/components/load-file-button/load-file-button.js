import { module } from 'angular';

require('./load-file-button.less');

export default module('app.components.load-file-button', [])
  .component('loadFileButton', {
    bindings: {
      accept: '@',
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
        reader.readAsText(event.target.files[0]);
      }
    },
    template: require('./load-file-button.html'),
    transclude: true,
  });
