import { combineReducers } from 'redux';
import alerts from '@triniti/cms/reducers/alerts.js';
import forms from '@triniti/cms/reducers/forms.js';
import navbar from '@triniti/cms/reducers/navbar.js';
import theme from '@triniti/cms/reducers/theme.js';

export default combineReducers({
  alerts,
  forms,
  navbar,
  theme,
});
