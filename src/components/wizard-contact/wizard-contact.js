import { module } from 'angular';

export default module('app.components.wizard-contact', [])
  .component('wizardContact', {
    bindings: {
      contact: '<',
      onContactUpdate: '&',
    },
    controller: class WizardContactCtrl {
      constructor() {
        'ngInject';
      }


    },
    template: require('./wizard-contact.html'),
  });
