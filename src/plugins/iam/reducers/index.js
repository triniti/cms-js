import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes } from '@triniti/cms/plugins/iam/constants.js';

export const initialState = {
  accessToken: null,
  isAuthenticated: false,
  policy: null,
  user: null,
};

const onLoginAccepted = (state, action) => ({
  ...state,
  accessToken: action.accessToken,
  isAuthenticated: true,
});

const onLoginRejected = () => initialState;
const onLoginCompleted = () => initialState;

const onUserLoaded = (state, action) => ({
  ...state,
  policy: action.policy,
  user: action.user,
});

export default createReducer(initialState, {
  [actionTypes.LOGIN_ACCEPTED]: onLoginAccepted,
  [actionTypes.LOGIN_REJECTED]: onLoginRejected,
  [actionTypes.LOGOUT_COMPLETED]: onLoginCompleted,
  [actionTypes.USER_LOADED]: onUserLoaded,
});
