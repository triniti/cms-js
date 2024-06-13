import setWebpackPublicPath from './webpackPublicPath.js';
import '../schemas.js';
import Raven from '@triniti/cms/plugins/raven/services/Raven.js';
import mqtt from 'mqtt';

setWebpackPublicPath();
let raven = null;

/**
 * We cannot pass `self.postMessage` directly to Raven service, so
 * this wrapper is created that works.
 * @param {*} msg
 */
async function postMessage (msg) {
  console.log('Raven Worker Message', msg);
  self.postMessage(msg);
}

/**
 * Handles Messages received from @app.
 * @param {*} param0
 */
self.onmessage = async function ({ data }) {
  const { event, payload } = data;
  switch (event) {
    case 'configure':
      const { apiEndpoint, appEnv, appName, appVendor, hostname } = payload;
      raven = new Raven(mqtt, apiEndpoint, appEnv, appName, appVendor, hostname, postMessage);
      self.postMessage('Raven Worker: Configured.');
      break;
    case 'connect':
      const { accessToken, userRef, currHref } = payload;
      await raven.connect(accessToken, userRef, currHref);
      self.postMessage('Raven Worker: Connected.');
      break;
    case 'disconnect':
      raven.disconnect();
      self.postMessage('Raven Worker: Disconnected.');
      break;
    case 'status':
      self.postMessage('Raven Worker: Status', { status: raven.status() });
      break;
    case 'publish':
      const { message, topic } = payload;
      raven.publish(message, topic);
      self.postMessage('Raven Worker: Publish');
      break;
    default:
      self.postMessage('Raven Worker: Invalid action.');
      self.close();
      break;
  }
};

export default self;
