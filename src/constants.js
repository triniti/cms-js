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
  REDUX_STORE: t('redux/store'),
  REDUX_LOGGER_PREDICATE: t('redux/logger_predicate'),
};

/**
 * @link http://redux.js.org/docs/basics/Actions.html
 *
 * @type {Object}
 */
export const actionTypes = {
  ALERT_SENT: t('alert_sent'),
  ALERT_DISMISSED: t('alert_dismissed'),
  ALERTS_CLEARED: t('alerts_cleared'),
  APP_STARTED: t('app_started'),
  FORM_REGISTERED: t('form_registered'),
  FORM_UNREGISTERED: t('form_unregistered'),
  LOGOUT_REQUESTED: t('logout_requested'),
  NAVBAR_CHANGED: t('navbar_changed'),
  THEME_CHANGED: t('theme_changed'),
  WORKERS_STARTED: t('workers_started'),
};

/**
 * Suffixes are typically used by {@see Pbjx.trigger}
 *
 * @see {FormEvent}
 */
export const SUFFIX_INIT_FORM = 'init_form';
export const SUFFIX_SUBMIT_FORM = 'submit_form';

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
