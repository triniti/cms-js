import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import pbj from '@gdbots/pbj';
import { setInstance } from '@triniti/app';
import schemas from '../schemas';
// // important:: load main scss BEFORE App
import './assets/styles/main.scss';
//
import './config/uriTemplates';
import App from './App';
import preloadedState from './config/preloadedState';
import Root from './Root';
//

window.onerror = (message, source, lineno, colno, err) => {
  const formattedPayload = JSON.stringify({
    message,
    source,
    lineno,
    colno,
    error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });
  // todo: integrate with reporting service and probably put in a new place
  console.error(`[window.onerror] ${formattedPayload}`);
  return false; // still fire the default event handler
};

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
