import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Loading, Navbar } from '@triniti/cms/components';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated';
import getUser from '@triniti/cms/plugins/iam/selectors/getUser';
import loadUser from '@triniti/cms/plugins/iam/actions/loadUser';
import AppRoutes from './config/Routes';

const LoggedIn = () => {
  const user = useSelector(getUser);
  if (!user) {
    return <Loading />;
  }

  return (
    <div id="wrapper" data-slidedirection="">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

const Login = lazy(() => import('@triniti/cms/plugins/iam/components/login-screen'));
const LoggedOut = () => <Routes><Route path="*" element={<Login />} /></Routes>;

function Root() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isAuthenticated);

  // fixme: cleanup the login/user fetch/raven/etc. process
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

export default Root;