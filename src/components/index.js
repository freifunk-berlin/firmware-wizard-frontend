import { module } from 'angular';

import languageDropdown from './language-dropdown/language-dropdown';
import navbar from './navbar/navbar';

export default module('app.components', [
  languageDropdown.name,
  navbar.name,
]);
