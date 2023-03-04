import './config/webpackPublicPath';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './assets/styles/main.scss';
import './config/uriTemplates';
import Root from './Root';
import createApp from './createApp';
import startWorkers from './workers';

let app = null;
export const getInstance = () => app;

(async () => {
  app = await createApp();
  window.cms = app;
  await app.start();
  await startWorkers(app);

  render(
    <Provider store={app.getRedux()}>
      <Root />
    </Provider>,
    document.getElementById('react-root'),
  );
})();
