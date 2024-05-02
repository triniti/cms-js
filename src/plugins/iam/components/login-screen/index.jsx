import noop from 'lodash-es/noop';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Button } from 'reactstrap';
import Loading from '@triniti/cms/components/loading/index.jsx';
import acceptLogin from '@triniti/cms/plugins/iam/actions/acceptLogin.js';
import { serviceIds } from '@triniti/cms/plugins/iam/constants.js';

const cache = {
  get: function (key) {
    if (key.includes(`${AUTH0_AUDIENCE}::openid`)) {
      sessionStorage.setItem(serviceIds.AUTH0_SESSION_KEY, key);
    }
    return JSON.parse(sessionStorage.getItem(key));
  },

  set: function (key, value) {
    if (key.includes(`${AUTH0_AUDIENCE}::openid`)) {
      sessionStorage.setItem(serviceIds.AUTH0_SESSION_KEY, key);
    }
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove: function (key) {
    sessionStorage.removeItem(key);
  },

  allKeys: function () {
    return Object.keys(sessionStorage);
  }
};

const onRedirectCallback = (navigate, appState) => {
  const returnTo = appState?.returnTo || window.location.pathname;
  const to = returnTo.startsWith('/log') ? '/' : returnTo;
  navigate(to, { replace: true });
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      return noop;
    }

    const getAccessToken = async () => {
      await dispatch(acceptLogin(await getAccessTokenSilently()));
      await navigate('/');
    };

    getAccessToken().then(noop).catch(noop);
  }, [isAuthenticated, getAccessTokenSilently]);

  let errorMsg = error?.message || '';
  if (!errorMsg || !errorMsg.includes || errorMsg.includes('is undefined')) {
    errorMsg = null;
  }

  return (
    <div className="text-center p-5">
      {(isLoading || errorMsg) && <Loading error={errorMsg} />}
      {!isLoading && <Button color="primary" size="lg" onClick={loginWithRedirect}>Login</Button>}
    </div>
  );
}

const authorizationParams = {
  redirect_uri: SITE_BASE_URL + 'login',
  audience: AUTH0_AUDIENCE,
  scope: 'openid profile email',
};

export default function LoginScreen() {
  const navigate = useNavigate();
  return (
    <Auth0Provider
      onRedirectCallback={(appState) => onRedirectCallback(navigate, appState)}
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={authorizationParams}
      cache={cache}
    >
      <Login />
    </Auth0Provider>
  );
}
