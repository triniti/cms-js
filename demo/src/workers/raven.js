import setWebpackPublicPath from './webpackPublicPath';
// import MessageResolver from '../schemas';
import Raven from 'plugins/raven/services/Raven';
import mqtt from 'mqtt';

setWebpackPublicPath();
let raven = null;

/**
 * We cannot pass `self.postMessage` directly to Raven service, so
 * this wrapper is created that works.
 * @param {*} msg 
 */
async function postMessage (msg) {
  console.log('Raven Worker Mesage', msg);
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
      console.log(`Payload from worker ${JSON.stringify(payload)}`);
      self.postMessage('Raven Worker: Configured.');
      break;
    case 'connect':
      const { accessToken, userId, currHref } = payload;
      await raven.connect(accessToken, userId, currHref);
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
