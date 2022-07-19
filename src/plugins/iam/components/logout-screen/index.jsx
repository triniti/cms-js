import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Loading from 'components/loading';
import logout from 'plugins/iam/actions/logout';

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, isLoading, logout: auth0Logout } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      dispatch(logout());
      //auth0Logout({ returnTo: APP_BASE_URL + 'login' });
      auth0Logout({ returnTo: 'https://localhost:3000/login' });
      'https://localhost:3000/login'
    } else {
      navigate(-1);
    }
  }, [isLoading, isAuthenticated]);

  return <Loading error={error && error.message}>Logging out...</Loading>;
}

export default function LogoutScreen() {
  return (
    <Auth0Provider
      audience={AUTH0_AUDIENCE}
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      //redirectUri={APP_BASE_URL + 'login'}
      redirectUri={'https://localhost:3000/login'}
    >
      <Logout />
    </Auth0Provider>
  );
}

