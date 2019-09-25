export const PLUGIN_PREFIX = '@triniti/iam/';
const t = (id) => `${PLUGIN_PREFIX}${id}`;

export const auth0config = {
  UI_THEME: {
    logo: '/logo-bachelornation.svg',
    primaryColor: '#04c5a2',
  },
};

export const serviceIds = {
  PREFIX: PLUGIN_PREFIX,
  API_ENDPOINT: t('api_endpoint'),

  // authenticators
  AUTHENTICATOR_PREFIX: t('authenticators/'),
  AUTHENTICATOR_PROVIDER: t('authenticator/provider'),
  AUTHENTICATOR: t('authenticator'),

  // auth0
  AUTHENTICATOR_AUTH0: t('authenticators/auth0'),
  AUTHENTICATOR_AUTH0_API_IDENTIFIER: t('authenticators/auth0/api_identifier'),
  AUTHENTICATOR_AUTH0_CLIENT_ID: t('authenticators/auth0/client_id'),
  AUTHENTICATOR_AUTH0_DOMAIN: t('authenticators/auth0/domain'),
  AUTHENTICATOR_AUTH0_UI_THEME: t('authenticators/auth0/ui_theme'),

  AUTHORIZER: t('authorizer'),
  ANDROID_APP_SUBSCRIBER: t('android_app_subscriber'),
  APP_SUBSCRIBER: t('app_subscriber'),
  APPLE_NEWS_APP_SUBSCRIBER: t('apple_news_app_subscriber'),
  BROWSER_APP_SUBSCRIBER: t('browser_app_subscriber'),
  EMAIL_APP_SUBSCRIBER: t('email_app_subscriber'),
  IOS_APP_SUBSCRIBER: t('ios_app_subscriber'),
  ROLE_SUBSCRIBER: t('role_subscriber'),
  USER_SUBSCRIBER: t('user_subscriber'),
};

export const routeIds = {
  PREFIX: PLUGIN_PREFIX,

  LOGIN: t('login'),

  // apps
  SEARCH_APPS: t('search_apps'),
  APP: t('app'),

  // users
  SEARCH_USERS: t('search_users'),
  USER: t('user'),

  // roles
  ROLE: t('role'),
  SEARCH_ROLES: t('search_roles'),

  INDEX: t('index'),
};

export const actionTypes = {
  PREFIX: PLUGIN_PREFIX,

  // authentication
  LOGIN_REQUESTED: t('LOGIN_REQUESTED'),
  LOGIN_ACCEPTED: t('LOGIN_ACCEPTED'),
  LOGIN_REJECTED: t('LOGIN_REJECTED'),
  LOGOUT_COMPLETED: t('LOGOUT_COMPLETED'),
  GET_AUTHENTICATED_USER_FULFILLED: t('GET_AUTHENTICATED_USER_FULFILLED'),
  GET_AUTHENTICATED_USER_REJECTED: t('GET_AUTHENTICATED_USER_REJECTED'),
  POLICY_UPDATED: t('POLICY_UPDATED'),
  SESSION_RENEWAL_REQUESTED: t('SESSION_RENEWAL_REQUESTED'),
  SESSION_RENEWAL_ACCEPTED: t('SESSION_RENEWAL_ACCEPTED'),
  SESSION_RENEWAL_REJECTED: t('SESSION_RENEWAL_REJECTED'),
  TEMP_LOGIN_REQUESTED: t('TEMP_LOGIN_REQUESTED'),
};

export const formNames = {
  CREATE_APP: t('create_app'),
  APP: t('app'),

  CREATE_ROLE: t('create_role'),
  ROLE: t('role'),

  CREATE_USER: t('create_user'),
  USER: t('user'),
};
