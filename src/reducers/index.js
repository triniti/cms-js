import { combineReducers } from 'redux';
import alerts from './alerts.js';
import forms from './forms.js';
import theme from './theme.js';

export default combineReducers({
  alerts,
  forms,
  theme,
});
