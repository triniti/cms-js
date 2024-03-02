import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Loading from 'components/loading';
import logout from 'plugins/iam/actions/logout';
import noop from 'lodash/noop';

function Logout() {
  const dispatch = useDispatch();
  const { error, isLoading, logout: auth0Logout } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return noop;
    }

    dispatch(logout());
    auth0Logout({
      logoutParams: {
        returnTo: SITE_BASE_URL + 'login/',
      },
    });
  }, [isLoading]);

  return <Loading error={error && error.message}>Logging out...</Loading>;
}

const authorizationParams = {
  redirect_uri: SITE_BASE_URL + 'login/',
  audience: AUTH0_AUDIENCE,
  scope: 'openid profile email',
};

export default function LogoutScreen() {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={authorizationParams}
    >
      <Logout />
    </Auth0Provider>
  );
}

