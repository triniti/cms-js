import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes } from '@triniti/cms/constants.js';

export const initialState = 'theme-light';

const onThemeChanged = (state, action) => action.theme;

export default createReducer(initialState, {
  [actionTypes.THEME_CHANGED]: onThemeChanged,
});
