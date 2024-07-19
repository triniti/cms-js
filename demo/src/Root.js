import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Loading, Navbar } from '@triniti/cms/components/index.js';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import getUser from '@triniti/cms/plugins/iam/selectors/getUser.js';
import loadUser from '@triniti/cms/plugins/iam/actions/loadUser.js';
import AppRoutes from './config/Routes.js';

const Login = lazy(() => import('@triniti/cms/plugins/iam/components/login-screen/index.js'));
const LoggedOut = () => <Routes><Route path="*" element={<Login />} /></Routes>;

function LoggedIn() {
  const user = useSelector(getUser);
  if (!user) {
    return <Loading />;
  }

  return (
    <div id="wrapper" className={`app-env-${APP_ENV}`} data-slidedirection>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default function Root() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isAuthenticated);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadUser());
    }
  }, [isLoggedIn]);

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        {isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </BrowserRouter>
    </Suspense>
  );
}
