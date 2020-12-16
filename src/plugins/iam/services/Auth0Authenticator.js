import Auth0Lock from 'auth0-lock';
import Authenticator from './Authenticator';
import AuthenticationException from '../exceptions/AuthenticationException';
import acceptSessionRenewal from '../actions/acceptSessionRenewal';
import rejectSessionRenewal from '../actions/rejectSessionRenewal';
import requestSessionRenewal from '../actions/requestSessionRenewal';
import './styles.scss';

/**
 * @link https://auth0.com/docs/apis
 * @link https://auth0.com/docs/libraries/lock/v10/api
 */
export default class Auth0Authenticator extends Authenticator {
  /**
   * @param {string} apiIdentifier - Auth0 API Identifier
   * @param {string} clientId      - Auth0 Client ID
   * @param {string} domain        - Auth0 Client Domain
   * @param {Object} store         - a redux store (used for dispatching auth actions)
   * @param {string} endpoint      - the API endpoint (what the authenticator is securing)
   * @param {object} uiTheme    - the ui config for auth0 lock
   */
  constructor(apiIdentifier, clientId, domain, store, endpoint, uiTheme) {
    super('auth0', store, endpoint);

    /** @type Auth0Lock lock */
    this.lock = new Auth0Lock(clientId, domain, {
      theme: uiTheme,
      closable: false,
      languageDictionary: {
        title: 'cms',
      },
      auth: {
        redirectUrl: `${window.location.origin}/login`,
        responseType: 'token',
        audience: apiIdentifier,
        params: {
          scope: 'openid profile email',
        },
      },
    });

    this.lock.on('authenticated', this.onAuth0Success.bind(this));
    this.lock.on('authorization_error', this.onAuth0Failure.bind(this));
  }

  /**
   * {@inheritDoc}
   */
  showLogin() {
    super.showLogin();
    const { hash } = window.location;

    if (hash) {
      if (hash.startsWith('#error')) {
        return;
      }

      if (hash.startsWith('#access_token')) {
        return;
      }
    }

    this.lock.show();
  }

  hideLogin() {
    this.lock.hide();
  }

  /**
   * {@inheritDoc}
   */
  logout() {
    super.logout();
    this.lock.logout({
      returnTo: `${window.location.origin}/login`,
    });
  }

  renewSession() {
    this.store.dispatch(requestSessionRenewal());
    this.lock.checkSession({}, (err, authResult) => {
      if (err || !authResult) {
        this.store.dispatch(rejectSessionRenewal(err));
        // todo:: this.lock.show()? logout() ?
      } else {
        const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
        this.setSession(authResult.accessToken, expiresAt);

        this.store.dispatch(acceptSessionRenewal(authResult.accessToken));
      }
    });
  }

  /**
   * @private
   *
   * @param {Object} authResult
   */
  onAuth0Success(authResult) {
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();

    super.onAuthenticationSuccess(authResult.accessToken, expiresAt);
  }

  /**
   * @private
   *
   * @param {Object} result
   */
  onAuth0Failure(result) {
    const message = result.errorDescription || result.error || 'Authentication Failed';
    super.onAuthenticationFailure(new AuthenticationException(this.provider, message));
    this.lock.show({
      flashMessage: {
        type: 'error',
        text: message,
      },
    });
  }
}
