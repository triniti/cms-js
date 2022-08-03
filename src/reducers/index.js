import { combineReducers } from 'redux';
import alerts from 'reducers/alerts';
import forms from 'reducers/forms';
import theme from 'reducers/theme';

export default combineReducers({
  alerts,
  forms,
  theme,
});
