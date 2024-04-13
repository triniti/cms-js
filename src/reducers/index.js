import { combineReducers } from 'redux';
import alerts from '@triniti/cms/reducers/alerts';
import forms from '@triniti/cms/reducers/forms';
import theme from '@triniti/cms/reducers/theme';

export default combineReducers({
  alerts,
  forms,
  theme,
});
