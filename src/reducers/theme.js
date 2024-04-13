import createReducer from '@triniti/cms/utils/createReducer';
import { actionTypes } from '@triniti/cms/constants';

export const initialState = 'theme-light';

const onThemeChanged = (state, action) => action.theme;

export default createReducer(initialState, {
  [actionTypes.THEME_CHANGED]: onThemeChanged,
});
