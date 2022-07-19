import createReducer from 'utils/createReducer';
import { actionTypes } from 'constants';

export const initialState = 'theme-light';

const onThemeChanged = (state, action) => action.theme;

export default createReducer(initialState, {
  [actionTypes.THEME_CHANGED]: onThemeChanged,
});
