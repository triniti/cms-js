import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Loading from '@triniti/cms/components/loading/index.js';
import logout from '@triniti/cms/plugins/iam/actions/logout.js';

function Logout() {
  const dispatch = useDispatch();
  const { error, isLoading, logout: auth0Logout } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    dispatch(logout());
    auth0Logout({
      logoutParams: {
        returnTo: APP_BASE_URL + 'login',
      },
    });
  }, [isLoading]);

  return <Loading error={error && error.message}>Logging out...</Loading>;
}

const authorizationParams = {
  redirect_uri: APP_BASE_URL + 'login',
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

