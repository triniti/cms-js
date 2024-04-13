/* globals API_ENDPOINT, APP_VERSION */
/* eslint-disable no-underscore-dangle */
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import md5 from 'md5';
import { actionTypes, ravenTypes, connectionStatus } from '@triniti/cms/plugins/raven/constants';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import publishMessage from '@triniti/cms/plugins/raven/actions/publishMessage';
import simplifyCollaborations from '@triniti/cms/plugins/raven/utils/simplifyCollaborations';


/**
 * Holds a list of collaborations along
 * with a timestamp of last action. The
 * timestamp is used for filtering stale
 * collaborations out of the list
 * maintained in redux.
 * 
 * eg:
 * {
 *  nodeRef: {
 *    userRef: timestamp,
 *  }
 * }
 */
let collaborations = {};


/**
 * Holds a clean list of collaborations
 * that is mirrored in redux for easy
 * selection. Redux only needs to know
 * the current collaborations, not each
 * heartbeat timestamp.
 * 
 * eg:
 * {
 *  nodeRef: [userRef]
 * }
 */
let collaborationsRedux = {};

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
  if (data && data.links && data.links.wss) {
    return data.links.wss;
  }
  return null;
}



export default class Raven {
  constructor(mqtt, apiEndpoint, appEnv, appName, appVendor, hostname, postMessage) {
    this.mqtt = mqtt;
    this.apiEndpoint = apiEndpoint;
    this.hostname = hostname;
    // pbjx topics never come from "local" as they run within AWS
    const pbjxEnv = appEnv === 'local' ? 'dev' : appEnv;
    this.pbjxTopic = `${appVendor}-pbjx/${pbjxEnv}/#`;
    this.topic = `${appVendor}-${appName}/${appEnv}/`;
    this.client = null;
    this.connecting = false;
    this.prevErrorHash = '';
    this.accessToken = null;
    this.postMessage = postMessage;
  }

  /**
   * @returns {boolean}
   */
  isConnected() {
    return this.client && this.client.connected;
  }

  /**
   * @returns {boolean}
   */
  isConnecting() {
    return this.connecting;
  }

  setConnectionStatus(status) {
    this.postMessage({
      event: 'updateConnectionStatus',
      status,
    });
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#connect
   *
   * @returns {Promise}
   */
  async connect(accessToken, userRef, currHref) {
    this.accessToken = accessToken;
    this.userRef = userRef;
    this.currHref = currHref;

    if (this.connecting) {
      console.info('raven::connecting');
      return;
    }

    if (this.isConnected()) {
      console.info('raven::already_connected');
      this.setConnectionStatus(connectionStatus.OPENED);
      return;
    }

    const disconnectMessage = publishMessage({ rt: ravenTypes.USER_DISCONNECTED }).message;
    disconnectMessage.user = `${userRef}`;

    const options = {
      // clientId: may want to use hash of user ref + random here
      will: {
        topic: `${this.topic}general`,
        payload: JSON.stringify(disconnectMessage),
        qos: 0,
        retain: false,
      },
      // disable reconnect until transformWsUrl supports promises
      reconnectPeriod: 0,
    };

    this.connecting = true;
    this.setConnectionStatus(connectionStatus.REQUESTED);

    try {
      const url = await getConnectUrl(this.apiEndpoint, accessToken);
      if (!url) {
        this.connecting = false;
        this.client = null;
        console.error('raven::connect_failed::no_url');
        return;
      }
      this.client = this.mqtt.connect(url, options);
    } catch (e) {
      this.connecting = false;
      this.client = null;
      this.onError(e);
      console.error('raven::connect_failed', e);
      return;
    }
    this.client.subscribe([this.pbjxTopic, `${this.topic}#`]);

    this.client.on('message', async (topic, message) => {
      this.connecting = false;
      let parsedMessage;

      try {
        parsedMessage = JSON.parse(`${message}`);
      } catch (e) {
        this.onError(e);
        console.error('raven::received_invalid_message', e, topic, message);
        return;
      }

      // If schema exists then its always an event
      if (parsedMessage._schema) {
        try {
          this.postMessage({
            event: 'eventReceived',
            message: parsedMessage,
          });
          return;
        } catch (e) {
          this.onError(e);
          console.error('raven::received_invalid_pbj', e, topic, message);
          return;
        }
      }

      this.receivedMessage(parsedMessage, topic.replace(this.topic, ''));
    });

    this.client.on('connect', () => {
      this.connecting = false;
      // this.store.dispatch(openConnection());
      // this.store.dispatch(connectUser());
      this.setConnectionStatus(connectionStatus.OPENED);
    });

    this.client.on('close', () => {
      this.connecting = false;
      setTimeout(() => {
        this.client = null;
        this.setConnectionStatus(connectionStatus.CLOSED);
      });
    });

    this.client.on('error', (err) => console.error('raven::error', err));
  }

  receivedMessage(message, topic = null) {
    if (!message || !message?.user) {
      return;
    }
    console.log('Raven received message:', {message, topic});
    const ts = Math.floor(Date.now() / 1000);
    const isMe = this.userRef === message.user;
    const fromLocal = false;
    if (topic) {
      collaborations[topic] = collaborations[topic] ? { ...collaborations[topic] } : {};
    }
    const ravenType = message.rt || 'unknown';
    const type = `RT_${ravenType.toUpperCase()}`;

    if (!actionTypes[type]) {
      console.error('raven::receiveFlow::not approved', type, receivedAction, action);
      // not an approved type, drop it
      return;
    }

    switch (message.rt) {
      case ravenTypes.COLLABORATOR_LEFT:
      case ravenTypes.USER_DISCONNECTED:
        delete collaborations[topic][message.user];
        if (isEmpty(collaborations[topic])) {
          delete collaborations[topic];
        }
        break;
  
      case ravenTypes.USER_CONNECTED:
        break;
  
      case ravenTypes.HEARTBEAT:
      case ravenTypes.COLLABORATOR_JOINED:
      default:
        if (!collaborations[topic]) {
          collaborations[topic] = {};
        }
        collaborations[topic][message.user] = ts;
        break;
    }

    if (!isMe) {
      this.postMessage({
        event: 'loadUser',
        userRef: message.user,
      });
    }

    const newCollaborationsRedux = simplifyCollaborations(collaborations);
    if (!isEqual(collaborationsRedux, newCollaborationsRedux)) {
      collaborationsRedux = newCollaborationsRedux;
      this.postMessage({
        event: 'updateCollaborations',
        collaborations: newCollaborationsRedux,
      });
    }

    // this.postMessage('Raven: Current state debug:');
    // this.postMessage({ ravenType, collaborations, newCollaborationsRedux });
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#mqttclientendforce-cb
   */
  disconnect() {
    this.connecting = false;
    if (!this.isConnected()) {
      return;
    }

    try {
      this.setConnectionStatus(connectionStatus.CLOSED);
      this.client.end();
    } catch (e) {
      this.onError(e);
      console.error('raven::disconnect::error', e);
    }

    setTimeout(() => {
      this.client = null;
    });
  }

  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
   *
   */
  onError(...args) {
    // const state = this.store.getState();
    // const accessToken = getAccessToken(state);
    const accessToken = this.accessToken;
    const errorData = args.find((arg) => arg instanceof Error) || args[0];

    let error;
    try {
      error = JSON.stringify(errorData, Object.getOwnPropertyNames(errorData || {}));
    } catch (e) {
      console.error('raven::onError::error', e);
    }

    error = (error || '').replaceAll('://', '[PROTOCOL_TOKEN]').replace(/(\/\.\.)+\/?/g, '[UP_DIRECTORY_TOKEN]');
    const errorHash = md5(error);
    if (
      isJwtExpired(accessToken)
      || this.hostname === 'localhost'
      || errorHash === this.prevErrorHash
      || !error.length
    ) {
      return;
    }

    const logData = {
      app_version: APP_VERSION,
      error,
      request_uri: this.currHref.replace('://', '[PROTOCOL_TOKEN]'),
    };

    fetch(`${API_ENDPOINT}/raven/errors/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify(logData),
    }).catch((e) => console.error('raven::onError::error', e));

    this.prevErrorHash = errorHash;
  }

  /**
   * @link https://github.com/mqttjs/MQTT.js#publish
   *
   * @param {Object}  message - message to publish (an object with rt key)
   * @param {?string} topic   - topic to publish
   */
  publish(message, topic = null) {
    const fullTopic = `${this.topic}${topic || 'general'}`;

    if (!this.isConnected()) {
      console.warn('raven::publish::not_connected', message, fullTopic);
      return;
    }

    try {
      this.client.publish(fullTopic, JSON.stringify(message));
    } catch (e) {
      this.onError(e);
      console.error('raven::publish::error', e, fullTopic, message);
    }
  }
}