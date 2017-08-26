import { module } from 'angular';

require('./load-file-button.less');

export default module('app.components.load-file-button', [])
  .component('loadFileButton', {
    bindings: {
      accept: '@',
      base64: '@',
      required: '@',
      onDismiss: '&',
      onLoaded: '&',
    },
    controller: class LoadFileButtonCtrl {
      constructor($element, $scope, $window) {
        'ngInject';

        this.$element = $element;
        this.$scope = $scope;
        this.$window = $window;
        this.bindedLoad = this.load.bind(this);
        $element.on('change', this.bindedLoad);
      }

      load(event) {
        if (!event.target.files || event.target.files.length === 0) return;
        const reader = new this.$window.FileReader();
        reader.onload = frEvent => this.$scope.$apply(() => {
          if (this.base64) {
            this.onLoaded({content: frEvent.target.result.split(',')[1]});
          } else {
            this.onLoaded({content: frEvent.target.result});
          }
        });
        if (this.base64) {
          reader.readAsDataURL(event.target.files[0]);
        } else {
          reader.readAsText(event.target.files[0]);
        }

        // reset file
        this.$element.off('change', this.bindedLoad);
        event.target.value = '';
        this.$element.on('change', this.bindedLoad);
      }
    },
    template: require('./load-file-button.html'),
    transclude: true,
  });
