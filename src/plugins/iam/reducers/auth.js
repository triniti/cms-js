import createReducer from '@triniti/app/createReducer';
import { actionTypes } from '../constants';

export const initialState = {
  isAuthenticated: false,
  user: null,
  policy: null,
  accessToken: null,
};

const {
  LOGIN_ACCEPTED,
  LOGOUT_COMPLETED,
  LOGIN_REJECTED,
  GET_AUTHENTICATED_USER_FULFILLED,
  GET_AUTHENTICATED_USER_REJECTED,
  POLICY_UPDATED,
} = actionTypes;

const onGetAuthenticatedUserFulfilled = (state, action) => (
  {
    ...state,
    user: action.user,
    policy: action.policy,
    accessToken: action.accessToken,
  }
);

const onPolicyUpdated = (state, action) => (
  {
    ...state,
    policy: action.policy,
  }
);


const onGetAuthenticatedUserRejected = () => initialState;
const onLoginAccepted = (state) => ({ ...state, isAuthenticated: true });
const onLogoutCompleted = () => initialState;
const onLoginRejected = () => initialState;

export default createReducer(initialState, {
  [GET_AUTHENTICATED_USER_FULFILLED]: onGetAuthenticatedUserFulfilled,
  [GET_AUTHENTICATED_USER_REJECTED]: onGetAuthenticatedUserRejected,
  [LOGIN_ACCEPTED]: onLoginAccepted,
  [LOGOUT_COMPLETED]: onLogoutCompleted,
  [LOGIN_REJECTED]: onLoginRejected,
  [POLICY_UPDATED]: onPolicyUpdated,
});
