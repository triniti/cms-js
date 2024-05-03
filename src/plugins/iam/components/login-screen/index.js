import noop from 'lodash-es/noop.js';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Button, Card, CardBody } from 'reactstrap';
import { Loading } from '@triniti/cms/components/index.js';
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
  const returnTo = appState?.returnTo || sessionStorage.getItem(serviceIds.AUTH0_RETURN_TO) || window.location.pathname;
  const to = returnTo.startsWith('/log') ? '/' : returnTo;
  navigate(to, { replace: true });
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const signUpWithRedirect = () => {
    loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const getAccessToken = async () => {
      await dispatch(acceptLogin(await getAccessTokenSilently()));

      const returnTo = sessionStorage.getItem(serviceIds.AUTH0_RETURN_TO) || '/';
      sessionStorage.removeItem(serviceIds.AUTH0_RETURN_TO);

      await navigate(returnTo);
    };

    getAccessToken().then(noop).catch(noop);
  }, [isAuthenticated, getAccessTokenSilently]);

  let errorMsg = error?.message || '';
  if (!errorMsg || !errorMsg.includes || errorMsg.includes('is undefined')) {
    errorMsg = null;
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <Card>
          <CardBody>
            <div className="mb-4 mt-4 pt-4">
              <div className="login-logo"><span>Triniti</span></div>
            </div>
            <h1 className="mb-5">{APP_VENDOR} CMS</h1>
            {(isLoading || errorMsg) && <Loading error={errorMsg} />}
            {!isLoading && (
              <>
                <Button color="primary" className="mr-5 rounded-pill ps-6 pe-6 fs-2 shadow" onClick={loginWithRedirect}>Log In</Button>
                <Button color="secondary" className="me-0 rounded-pill ps-6 pe-6 fs-2 shadow" onClick={signUpWithRedirect}>Sign Up</Button>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

const authorizationParams = {
  redirect_uri: SITE_BASE_URL + 'login',
  audience: AUTH0_AUDIENCE,
  scope: 'openid profile email',
};

export default function LoginScreen() {
  useEffect(() => {
    const returnTo = window.location.pathname;
    if (returnTo.startsWith('/log')) {
      return;
    }

    sessionStorage.setItem(serviceIds.AUTH0_RETURN_TO, window.location.pathname);
  }, []);

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
