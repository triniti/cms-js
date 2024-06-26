export const SERVICE_PREFIX = 'app/';
const t = id => `${SERVICE_PREFIX}${id}`;

/**
 * Any services registered should use these identifiers.
 *
 * @link https://martinfowler.com/articles/injection.html#UsingAServiceLocator
 *
 * @type {Object}
 */
export const serviceIds = {
  PREFIX: SERVICE_PREFIX,
  REDUX_STORE: t('redux/store'),
  REDUX_LOGGER_PREDICATE: t('redux/logger_predicate'),
};

/**
 * @link http://redux.js.org/docs/basics/Actions.html
 *
 * @type {Object}
 */
export const actionTypes = {
  PREFIX: SERVICE_PREFIX,
  ALERT_SENT: t('ALERT_SENT'),
  ALERT_DISMISSED: t('ALERT_DISMISSED'),
  ALERTS_CLEARED: t('ALERTS_CLEARED'),
  APP_STARTED: t('APP_STARTED'),
  FORM_REGISTERED: t('FORM_REGISTERED'),
  FORM_UNREGISTERED: t('FORM_UNREGISTERED'),
  LOGOUT_REQUESTED: t('LOGOUT_REQUESTED'),
  NAVBAR_CHANGED: t('NAVBAR_CHANGED'),
  THEME_CHANGED: t('THEME_CHANGED'),
  WORKERS_STARTED: t('WORKERS_STARTED'),
};

/**
 * Common statuses for managing state changes for async operations.
 * Use these constants for consistency and clarity when creating
 * actions, reducers, selectors that need to know about the "state".
 */
export const STATUS_NONE = 'none';
export const STATUS_PENDING = 'pending';
export const STATUS_FULFILLED = 'fulfilled';
export const STATUS_REJECTED = 'rejected';
export const STATUS_FAILED = 'failed';

export const THEME_STORAGE_KEY = 'theme';
