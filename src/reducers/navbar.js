import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes } from '@triniti/cms/constants.js';

export const initialState = {
  primary: 'dashboard',
  secondary: '',
};

const onNavbarChanged = (prevState, action) => {
  return { primary: action.primary, secondary: action.secondary };
}

export default createReducer(initialState, {
  [actionTypes.NAVBAR_CHANGED]: onNavbarChanged,
});
