/* eslint-disable react/prop-types */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import App from '@triniti/admin-ui-plugin/components/app';
import getUserConfirmation from '@triniti/admin-ui-plugin/utils/getUserConfirmation';
import ProtectedRoute from '../../src/plugins/iam/components/protected-route';
import Nav from './Nav';

const Root = ({ store, routes, baseUrl }) => (
  <Provider store={store}>
    <BrowserRouter basename={baseUrl} getUserConfirmation={getUserConfirmation}>
      <App
        authHoc={ProtectedRoute}
        navComponent={<Nav store={store} />}
        routes={routes}
      />
    </BrowserRouter>
  </Provider>
);

export default hot(module)(Root);
