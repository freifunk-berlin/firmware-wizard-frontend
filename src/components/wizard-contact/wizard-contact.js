import { copy, module } from 'angular';

export default module('app.components.wizard-contact', [])
  .component('wizardContact', {
    bindings: {
      contact: '<',
      emailRequired: '<',
      onContactUpdate: '&',
    },
    controller: class WizardContactCtrl {
      constructor($scope) {
        'ngInject';

        this.newContact = {};

        $scope.$watchCollection('$ctrl.contact', this.updateFromInput.bind(this));
        $scope.$watchCollection('$ctrl.newContact', this.updateContactOutput.bind(this));
      }

      updateFromInput(contact) {
        copy(contact, this.newContact);
      }

      updateContactOutput(newContact) {
        const contact = copy(newContact);
        contact.name = contact.name || undefined;
        contact.email = contact.email || undefined;
        this.onContactUpdate({contact});
      }
    },
    template: require('./wizard-contact.html'),
  });
