import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import pbj from '@gdbots/pbj';
import schemas from '@bachelornation/schemas';
import { setInstance } from '@triniti/app';
// // important:: load main scss BEFORE App
// import 'assets/styles/main.scss';
//
import './config/uriTemplates';
import App from './App';
import preloadedState from './config/preloadedState';
import Root from './Root';
//
const app = new App(preloadedState);
setInstance(app);
app.start();

const MOUNT_NODE = document.getElementById('root');
render(
  <Root
    store={app.getStore()}
    routes={app.getRoutes()}
    baseUrl={app.getContainer().get('app_base_url')}
  />,
  MOUNT_NODE,
);

window.triniti = {
  app,
  pbj,
  schemas,
};
