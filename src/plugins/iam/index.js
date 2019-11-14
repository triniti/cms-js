/* globals API_ENDPOINT, AUTH0_API_IDENTIFIER, AUTH0_CLIENT_ID, AUTH0_DOMAIN */
/* eslint-disable class-methods-use-this */
import { serviceIds as appServiceIds } from '@triniti/app/constants';
import Plugin from '@triniti/app/Plugin';
import reducer from './reducers';
import routes from './routes';
import saga from './sagas';
import Auth0Authenticator from './services/Auth0Authenticator';
import Authorizer from './services/Authorizer';
import AndroidAppSubscriber from './services/AndroidAppSubscriber';
import AppleNewsAppSubscriber from './services/AppleNewsAppSubscriber';
import AppSubscriber from './services/AppSubscriber';
import BrowserAppSubscriber from './services/BrowserAppSubscriber';
import EmailAppSubscriber from './services/EmailAppSubscriber';
import IosAppSubscriber from './services/IosAppSubscriber';
import RoleSubscriber from './services/RoleSubscriber';
import UserSubscriber from './services/UserSubscriber';
import { serviceIds, auth0config } from './constants';

export default class IamPlugin extends Plugin {
  constructor() {
    super('triniti', 'iam', '0.2.10');
  }

  configure(app, bottle) {
    this.routes = routes;
    this.reducer = reducer;
    this.saga = saga;

    bottle.constant(serviceIds.API_ENDPOINT, API_ENDPOINT);

    // auth0 provider
    bottle.constant(serviceIds.AUTHENTICATOR_AUTH0_API_IDENTIFIER, AUTH0_API_IDENTIFIER);
    bottle.constant(serviceIds.AUTHENTICATOR_AUTH0_CLIENT_ID, AUTH0_CLIENT_ID);
    bottle.constant(serviceIds.AUTHENTICATOR_AUTH0_DOMAIN, AUTH0_DOMAIN);
    bottle.constant(serviceIds.AUTHENTICATOR_AUTH0_UI_THEME, auth0config.UI_THEME);
    bottle.service(
      serviceIds.AUTHENTICATOR_AUTH0,
      Auth0Authenticator,
      serviceIds.AUTHENTICATOR_AUTH0_API_IDENTIFIER,
      serviceIds.AUTHENTICATOR_AUTH0_CLIENT_ID,
      serviceIds.AUTHENTICATOR_AUTH0_DOMAIN,
      appServiceIds.REDUX_STORE,
      serviceIds.API_ENDPOINT,
      serviceIds.AUTHENTICATOR_AUTH0_UI_THEME,
    );

    // authenticator (determined by the provider which defaults to auth0)
    bottle.value(serviceIds.AUTHENTICATOR_PROVIDER, 'auth0');
    bottle.factory(serviceIds.AUTHENTICATOR, (ctr) => {
      const prefix = serviceIds.AUTHENTICATOR_PREFIX;
      const provider = `${prefix}${ctr[serviceIds.AUTHENTICATOR_PROVIDER]}`;
      return ctr[provider];
    });

    bottle.service(serviceIds.AUTHORIZER, Authorizer);
    bottle.service(serviceIds.ANDROID_APP_SUBSCRIBER, AndroidAppSubscriber);
    bottle.service(serviceIds.APP_SUBSCRIBER, AppSubscriber);
    bottle.service(serviceIds.APPLE_NEWS_APP_SUBSCRIBER, AppleNewsAppSubscriber);
    bottle.service(serviceIds.BROWSER_APP_SUBSCRIBER, BrowserAppSubscriber);
    bottle.service(serviceIds.EMAIL_APP_SUBSCRIBER, EmailAppSubscriber);
    bottle.service(serviceIds.IOS_APP_SUBSCRIBER, IosAppSubscriber);
    bottle.service(serviceIds.USER_SUBSCRIBER, UserSubscriber);
    bottle.service(
      serviceIds.ROLE_SUBSCRIBER,
      RoleSubscriber,
      serviceIds.AUTHENTICATOR,
      appServiceIds.CONTAINER,
    );
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.AUTHORIZER,
      serviceIds.ANDROID_APP_SUBSCRIBER,
      serviceIds.APP_SUBSCRIBER,
      serviceIds.APPLE_NEWS_APP_SUBSCRIBER,
      serviceIds.BROWSER_APP_SUBSCRIBER,
      serviceIds.EMAIL_APP_SUBSCRIBER,
      serviceIds.IOS_APP_SUBSCRIBER,
      serviceIds.ROLE_SUBSCRIBER,
      serviceIds.USER_SUBSCRIBER,
    ];
  }
}
