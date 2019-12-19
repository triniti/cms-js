/* eslint-disable no-underscore-dangle */
import startCase from 'lodash/startCase';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import requestConnection from '../actions/requestConnection';
import openConnection from '../actions/openConnection';
import closeConnection from '../actions/closeConnection';
import connectUser from '../actions/connectUser';
import disconnectUser from '../actions/disconnectUser';
import receiveMessage from '../actions/receiveMessage';
import sendText from '../actions/sendText';

const isConnected = (client) => client && client.connected;

/**
 * Gets the URL that is needed to connect to the Raven
 * endpoint (an mqtt endpoint provided by Aws Iot).
 *
 * @param {string} apiEndpoint
 * @param {Object} accessToken
 *
 * @returns {Promise.<string>}
 */
async function getConnectUrl(apiEndpoint, accessToken) {
  const response = await fetch(`${apiEndpoint}/raven/connect/`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });
  const data = await response.json();
  return data.links.wss;
}

export default class Raven {
  constructor(mqtt, store, apiEndpoint, appVendor, appName, appEnv) {
    Object.defineProperty(this, 'mqtt', { value: mqtt });
    Object.defineProperty(this, 'store', { value: store });
    Object.defineProperty(this, 'apiEndpoint', { value: apiEndpoint });

    // pbjx topics never come from "local" as they run within AWS
    const pbjxEnv = appEnv === 'local' ? 'dev' : appEnv;
    Object.defineProperty(this, 'pbjxTopic', { value: `${appVendor}-pbjx/${pbjxEnv}/#` });
    Object.defineProperty(this, 'topic', { value: `${appVendor}-${appName}/${appEnv}/` });
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#connect
   *
   * @returns {Promise}
   */
  async connect() {
    if (isConnected(this.client)) {
      this.store.dispatch(openConnection());
      return;
    }

    const state = this.store.getState();
    const accessToken = getAccessToken(state);
    const userRef = getAuthenticatedUserRef(state);

    const disconnectMessage = disconnectUser().message;
    disconnectMessage.user = `${userRef}`;

    const options = {
      // clientId: may want to use hash of user ref + random here
      will: {
        topic: `${this.topic}general`,
        payload: JSON.stringify(disconnectMessage),
        qos: 0,
        retain: false,
      },
    };

    this.store.dispatch(requestConnection());
    this.client = this.mqtt.connect(await getConnectUrl(this.apiEndpoint, accessToken), options);
    this.client.subscribe([this.pbjxTopic, `${this.topic}#`]);

    this.client.on('message', (topic, message) => {
      let parsedMessage;

      try {
        parsedMessage = JSON.parse(`${message}`);
      } catch (e) {
        console.error('raven::received_invalid_message', e, topic, message);
        return;
      }

      if (parsedMessage._schema) {
        try {
          const pbj = ObjectSerializer.deserialize(parsedMessage).freeze();
          if (!pbj.schema().hasMixin('gdbots:pbjx:mixin:event')) {
            console.error('raven::received_pbj_is_not_event', topic, message);
            return;
          }

          this.store.dispatch(pbj);

          // if we have a node_ref we'll also create a "TEXT" message
          // into the collaboration so users can see what happened.
          if (pbj.has('node_ref')) {
            const text = startCase(pbj.schema().getCurie().getMessage());
            const action = receiveMessage(sendText(text).message, pbj.get('node_ref').toString());
            action.ts = Math.floor(pbj.get('occurred_at').toDate() / 1000);
            action.message.user = pbj.has('ctx_user_ref')
              ? NodeRef.fromMessageRef(pbj.get('ctx_user_ref')).toString()
              : null;
            action.message.pbj = pbj;
            action.fromLocal = true;
            this.store.dispatch(action);
          }
          return;
        } catch (e) {
          console.error('raven::received_invalid_pbj', e, topic, message);
          return;
        }
      }

      this.store.dispatch(receiveMessage(parsedMessage, topic.replace(this.topic, '')));
    });

    this.client.on('connect', () => {
      this.store.dispatch(openConnection());
      this.store.dispatch(connectUser());
    });

    this.client.on('close', () => this.store.dispatch(closeConnection()));
    this.client.on('error', (err) => console.error('raven::error', err));
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#mqttclientendforce-cb
   */
  disconnect() {
    if (!isConnected(this.client)) {
      return;
    }

    try {
      this.store.dispatch(disconnectUser());
      this.client.end();
    } catch (e) {
      console.error('raven::disconnect::error', e);
    }
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#publish
   *
   * @param {Object}  message - message to publish (an object with rt key)
   * @param {?string} topic   - topic to publish
   */
  publish(message, topic = null) {
    const fullTopic = `${this.topic}${topic || 'general'}`;

    if (!isConnected(this.client)) {
      console.warn('raven::publish::not_connected', message, fullTopic);
      return;
    }

    try {
      this.client.publish(fullTopic, JSON.stringify(message));
    } catch (e) {
      console.error('raven::publish::error', e, fullTopic, message);
    }
  }
}
