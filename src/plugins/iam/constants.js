export const PLUGIN_PREFIX = 'iam/';
const t = id => `${PLUGIN_PREFIX}${id}`;

export const serviceIds = {
  AUTHORIZER: t('authorizer'),
  AUTH0_SESSION_KEY: t('auth0_session_key'),
  AUTH0_RETURN_TO: t('auth0_return_to'),
};

export const actionTypes = {
  LOGIN_ACCEPTED: t('login_accepted'),
  LOGIN_REJECTED: t('login_rejected'),
  LOGOUT_COMPLETED: t('logout_completed'),
  USER_LOADED: t('user_loaded'),
};
