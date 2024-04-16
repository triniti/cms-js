import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import React from 'react';
import { createRoot } from 'react-dom/client';
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
  const container = document.getElementById('root');

  createRoot(container).render(
    <Provider store={app.getRedux()}>
      <Root />
    </Provider>
  );
})();
