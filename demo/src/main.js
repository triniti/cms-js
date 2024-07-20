// do we still need these?
//import 'core-js/stable/index.js';
//import 'regenerator-runtime/runtime.js';
//import 'whatwg-fetch';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './assets/styles/main.scss';
import './config/uriTemplates.js';
import Root from './Root.js';
import createApp from './createApp.js';
import startWorkers from './workers/index.js';

let app = null;
export const getInstance = () => app;

(async () => {
  app = await createApp();
  window.cms = app;
  await app.start();
  await startWorkers(app);
  const container = document.getElementById('react-root');

  createRoot(container).render(
    <Provider store={app.getRedux()}>
      <Root />
    </Provider>
  );
})().catch(console.error);
