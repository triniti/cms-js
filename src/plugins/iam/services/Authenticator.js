/* eslint-disable class-methods-use-this */
import swal from 'sweetalert2';
import throttle from 'lodash/throttle';

import Exception from '@gdbots/common/Exception';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1';
import HttpCode from '@gdbots/schemas/gdbots/pbjx/enums/HttpCode';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import { vendorToHttp } from '@gdbots/pbjx/utils/statusCodeConverter';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope';

import HttpRequestFailed from '../exceptions/HttpRequestFailed';
import authRedirectTo from '../utils/authRedirectTo';
import authUser from '../utils/authUser';
import authRoles from '../utils/authRoles';
import isJwtExpired from '../utils/isJwtExpired';
import acceptLogin from '../actions/acceptLogin';
import rejectLogin from '../actions/rejectLogin';

const AUTH_EXPIRES_AT_KEY = 'iam.auth.expiresAt';
const USER_INACTIVE_EXPIRES_AT = 'iam.auth.inactiveExpiresAt';
const INACTIVE_OFFSET = 6 * 3600 * 1000; // 6 hours, in milisseconds

const clearStorage = () => {
  authRedirectTo.clear();
  authUser.clear();
  authRoles.clear();
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
  localStorage.removeItem(USER_INACTIVE_EXPIRES_AT);
};

/**
 * @type {?Number}
 */
let checkUserIdleInterval;

export default class Authenticator {
  /**
   * @param {string} provider - the name of the provider
   * @param {Object} store    - a redux store (used for dispatching auth actions)
   * @param {string} endpoint - the API endpoint (what the authenticator is securing)
   */
  constructor(provider, store, endpoint) {
    Object.defineProperty(this, 'provider', { value: provider });
    Object.defineProperty(this, 'store', { value: store });
    Object.defineProperty(this, 'endpoint', { value: endpoint });

    if (this.isAuthenticated()) {
      this.setUserInactiveExpiresAt();
      this.scheduleRenewal();
      this.checkUserIdle();
    }
  }

  /**
   * Shows a login screen/dialog/popup/etc. to the user.
   */
  showLogin() {
    // implement in concrete authenticator
  }

  /**
   * Hides a login screen/dialog/popup/etc. from the user.
   */
  hideLogin() {
    // implement in concrete authenticator
  }

  /**
   * Clears any auth related data in storage.
   */
  logout() {
    this.tokenRenewalTimeout = null;
    if (checkUserIdleInterval) {
      clearInterval(checkUserIdleInterval);
    }

    clearStorage();
    this.clearIdleListener();
  }

  /**
   * Renew session before token expires if user still has active actions
   */
  renewSession() {
    // implement in concrete authenticator
  }

  scheduleRenewal() {
    /** @var {number} expiresAt - time in miliseconds */
    const expiresAt = this.getExpiresAt();
    let timeout = expiresAt - new Date().getTime();
    const offset = 10 * 60 * 1000; // should trigger renewal process 10 mins earlier than expire

    if (timeout > 0 && timeout <= offset) {
      window.setTimeout(() => {
        this.renewSession();
      }, 0);
    } else if (timeout > offset) {
      timeout -= offset;
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  /**
   * @param {string} accessToken
   * @param {number} expiresAt
   */
  onAuthenticationSuccess(accessToken, expiresAt) {
    this.setSession(accessToken, expiresAt);
    this.store.dispatch(acceptLogin(accessToken));
    this.setUserInactiveExpiresAt();
    this.scheduleRenewal();
  }

  /**
   * @param {AuthenticationException} exception
   */
  onAuthenticationFailure(exception) {
    this.tokenRenewalTimeout = null;
    if (checkUserIdleInterval) {
      clearInterval(checkUserIdleInterval);
      checkUserIdleInterval = null;
    }

    clearStorage();
    this.clearIdleListener();
    this.store.dispatch(rejectLogin(exception));
  }

  /**
   * @param {string} accessToken
   *
   * @returns {Promise.<Message>} Resolves with a message using mixin 'gdbots:iam:mixin:user'
   */
  async getUser(accessToken) {
    let envelope;

    try {
      const response = await fetch(`${this.endpoint}/me`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      envelope = ObjectSerializer.deserialize(await response.json());
      this.store.dispatch(receiveEnvelope(envelope));
    } catch (e) {
      let code = Code.UNAVAILABLE.getValue();
      if (e instanceof Exception) {
        code = e.getCode() || code;
      }

      envelope = EnvelopeV1.create()
        .set('ok', false)
        .set('code', code)
        .set('http_code', HttpCode.create(vendorToHttp(code)))
        .set('error_name', e.name)
        .set('error_message', e.message.substr(0, 2048));
    }

    if (envelope.get('ok')) {
      const user = envelope.get('message');
      user.freeze();
      authUser.set(user);
      // fixme: this seems weird, should just fetch /me whenever app starts
      // to ensure a fresh copy is pulled
      authRoles.set(Object.values(envelope.get('derefs', {})));
      return user;
    }

    throw new HttpRequestFailed(envelope);
  }

  /**
   * @returns {string}
   */
  static getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  /**
   * @returns {number}
   */
  getExpiresAt() {
    return parseInt(localStorage.getItem(AUTH_EXPIRES_AT_KEY), 10);
  }

  /**
   * @returns {number}
   */
  getUserInactiveExpiresAt() {
    return parseInt(localStorage.getItem(USER_INACTIVE_EXPIRES_AT), 10);
  }

  /**
   * Set a new user inactive expiration time: 6 hours later
   */
  setUserInactiveExpiresAt() {
    const value = new Date().getTime() + INACTIVE_OFFSET;

    if (Authenticator.getAccessToken() !== null) {
      localStorage.setItem(USER_INACTIVE_EXPIRES_AT, value);
    }
  }

  /**
   * @param {string} token
   * @param {number|string} expiresAt
   */
  setSession(token, expiresAt) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_EXPIRES_AT_KEY, expiresAt);
  }

  /**
   * @returns {boolean}
   */
  isAuthenticated() {
    return !isJwtExpired(Authenticator.getAccessToken());
  }

  /**
   * Check if user still have active actions on cms
   * If user is idled more than INACTIVE_OFFSET hours. Log them out.
   */
  checkUserIdle() {
    checkUserIdleInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const userInactiveExpiresAt = this.getUserInactiveExpiresAt();

      // checking against access token will allow the localStorage to be cleared properly
      // when the user has multiple tabs
      if (currentTime > userInactiveExpiresAt || Authenticator.getAccessToken() === null) {
        clearStorage();
        this.clearIdleListener();
        clearInterval(checkUserIdleInterval);
        checkUserIdleInterval = null;

        swal.fire({
          title: 'You have been logged out!',
          type: 'info',
          allowOutsideClick: false,
          backdrop: 'rgba(222, 222, 222, 0.9)',
          target: document.body,
        }).then((result) => {
          if (result.value && Authenticator.getAccessToken() === null) {
            this.logout();
          } else {
            window.location.reload();
          }
        });
      }
    }, 60 * 1000);

    ['click', 'keypress'].forEach((event) => {
      document.addEventListener(event, throttle(this.setUserInactiveExpiresAt, 10 * 1000));
    });
  }

  /**
   * Clear event listener for user idle status check
   */
  clearIdleListener() {
    ['click', 'keypress'].forEach((event) => {
      document.removeEventListener(event, this.setUserInactiveExpiresAt);
    });
  }
}
