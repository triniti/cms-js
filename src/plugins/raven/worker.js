import mqtt from 'mqtt';
import { actionTypes as appActionTypes } from '@triniti/cms/constants.js';
import { actionTypes, connectionStatus } from '@triniti/cms/plugins/raven/constants.js';

const LOG_PREFIX = `raven.v${APP_VERSION}/`;
const MAX_CONNECT_ATTEMPTS = 5;

class Raven {
  #endpoint = null;
  #appEnv = 'dev';
  #client = null;
  #status = connectionStatus.DISCONNECTED;
  #appTopic = `${APP_VENDOR}-${APP_NAME}/${this.#appEnv}/`;
  #pbjxTopic = `${APP_VENDOR}-pbjx/${this.#appEnv}/`;
  #accessToken = null;
  #userRef = null;
  #nodeRef = null; // the node a user is subscribed to and/or collaborating with.
  #collaborating = false;

  #isConnected() {
    return this.#client && this.#client.connected;
  }

  async #getConnectUrl() {
    const response = await fetch(`${this.#endpoint}connect/`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${this.#accessToken}`,
      },
      credentials: 'include',
    });

    const data = await response.json();
    const url = data?.links?.wss;
    if (!url) {
      throw new Error('Response from server doesn\'t have wss link.');
    }

    return url;
  }

  async #publish(action, topic = 'raven') {
    if (!this.#isConnected()) {
      console.warn(`${LOG_PREFIX}publish/not_connected`, action);
      return;
    }

    const fullTopic = `${this.#appTopic}${topic}`;
    try {
      await this.#client.publishAsync(fullTopic, JSON.stringify(action));
    } catch (e) {
      console.error(`${LOG_PREFIX}publish/error`, e.message, fullTopic, action);
    }
  }

  #receive(message, topic) {
    this.#status = connectionStatus.CONNECTED;

    if (topic.startsWith(this.#pbjxTopic) && message._schema) {
      if (!this.#nodeRef || !message.node_ref) {
        // we are not subscribed to any nodes right now, ignore
        return;
      }

      const nodeRef = message.node_ref;
      if (this.#nodeRef !== nodeRef) {
        return;
      }

      self.postMessage({ type: actionTypes.PUBLISH_EVENT, nodeRef, pbj: message, fromWss: true });
      return;
    }

    if (topic.startsWith(this.#appTopic)) {
      const type = (message?.type || 'invalid').replace(actionTypes.PREFIX, '').toUpperCase();
      if (!actionTypes[type]) {
        console.error(`${LOG_PREFIX}receive/type_not_allowed`, type, topic, message);
        return;
      }

      message.isMine = message.userRef && (message.userRef === this.#userRef);
      message.fromWss = true;
      self.postMessage(message);
      return;
    }

    console.warn(`${LOG_PREFIX}receive/unknown_topic`, topic, message);
  }

  async start(action) {
    this.#appEnv = action.appEnv;
    this.#endpoint = `${action.apiEndpoint}/raven/`;
    this.#appTopic = `${APP_VENDOR}-${APP_NAME}/${this.#appEnv}/`;

    // pbjx topics never come from "local" as they run within AWS
    const pbjxEnv = this.#appEnv === 'local' ? 'dev' : this.#appEnv;
    this.#pbjxTopic = `${APP_VENDOR}-pbjx/${pbjxEnv}/`;
    console.info(`${LOG_PREFIX}start`, action);
  }

  async setToken(action) {
    this.#accessToken = action.accessToken;
    this.#userRef = action.userRef;

    if (!this.#isConnected()) {
      await this.connect(action);
    }
  }

  async connect(action) {
    this.#accessToken = action.accessToken;
    this.#userRef = action.userRef;

    if (this.#status === connectionStatus.CONNECTING) {
      console.info(`${LOG_PREFIX}connecting`);
      return;
    }

    if (this.#isConnected()) {
      this.#status = connectionStatus.CONNECTED;
      console.info(`${LOG_PREFIX}already_connected`);
      self.postMessage({ type: actionTypes.CONNECTED, userRef: this.#userRef, isMine: true });
      return;
    }

    this.#status = connectionStatus.CONNECTING;
    self.postMessage({ type: actionTypes.CONNECTING });
    let url;

    try {
      url = await this.#getConnectUrl();
    } catch (e) {
      console.error(`${LOG_PREFIX}connect/getConnectUrl/error`, e.message);
      this.#status = connectionStatus.FAILED;
      self.postMessage({ type: actionTypes.CONNECT_FAILED, reason: e.message });
      return;
    }

    let attempts = 0;
    do {
      attempts++;
      try {
        this.#client = await mqtt.connectAsync(url, {
          // clientId: may want to use hash of user ref + random here
          will: {
            topic: `${this.#appTopic}raven`,
            payload: JSON.stringify({ type: actionTypes.DISCONNECTED, userRef: this.#userRef, fromWill: true }),
            qos: 0,
            retain: false,
          },
          connectTimeout: 5000,
          // disable reconnect until transformWsUrl supports promises
          reconnectPeriod: 0,
        }, true);
        this.#status = connectionStatus.CONNECTED;
        break;
      } catch (e) {
        console.warn(`${LOG_PREFIX}connect/error`, e.message, attempts);
      }
    } while (attempts <= MAX_CONNECT_ATTEMPTS);

    if (!this.#isConnected()) {
      console.error(`${LOG_PREFIX}connect/too_many_attempts`);
      this.#status = connectionStatus.FAILED;
      self.postMessage({ type: actionTypes.CONNECT_FAILED, reason: 'too_many_attempts' });
      return;
    }

    this.#client.on('error', (error) => console.error(`${LOG_PREFIX}mqtt/error`, error));

    this.#client.on('close', () => {
      setTimeout(() => {
        console.info(`${LOG_PREFIX}mqtt/close`);
        this.#client = null;
        this.#status = connectionStatus.DISCONNECTED;
        self.postMessage({ type: actionTypes.DISCONNECTED, userRef: this.#userRef, isMine: true });
      });
    });

    this.#client.on('message', (topic, payload) => {
      let message;

      try {
        message = JSON.parse(`${payload}`);
      } catch (e) {
        console.error(`${LOG_PREFIX}mqtt/message/parse_error`, e.message, topic, payload);
        return;
      }

      this.#receive(message, topic);
    });

    try {
      await this.#client.subscribeAsync([`${this.#appTopic}#`, `${this.#pbjxTopic}#`]);
    } catch (e) {
      console.error(`${LOG_PREFIX}subscribe/error`, e.message);
      this.#status = connectionStatus.FAILED;
      self.postMessage({ type: actionTypes.CONNECT_FAILED, reason: e.message });
      return;
    }

    await this.#publish({ type: actionTypes.CONNECTED, userRef: this.#userRef });

    if (this.#nodeRef && this.#collaborating) {
      await this.joinCollaboration({
        nodeRef: this.#nodeRef,
        ts: Math.floor(Date.now() / 1000),
        fromConnect: true,
      });
    }
  }

  async disconnect() {
    if (!this.#isConnected()) {
      console.info(`${LOG_PREFIX}disconnect/not_connected`);
      this.#status = connectionStatus.DISCONNECTED;
      return;
    }

    if (this.#nodeRef && this.#collaborating) {
      await this.leaveCollaboration({ nodeRef: this.#nodeRef });
    }

    await this.unsubscribe();

    try {
      await this.#publish({ type: actionTypes.DISCONNECTED, userRef: this.#userRef });
      await this.#client.endAsync();
    } catch (e) {
      console.error(`${LOG_PREFIX}disconnect/error`, e.message);
      this.#status = connectionStatus.DISCONNECTED;
      self.postMessage({ type: actionTypes.DISCONNECTED, userRef: this.#userRef, isMine: true });
    }
  }

  async reconnect() {
    if (this.#isConnected()) {
      return;
    }

    if (!this.#accessToken || !this.#userRef) {
      console.error(`${LOG_PREFIX}reconnect/no_token`);
      return;
    }

    return this.connect({ accessToken: this.#accessToken, userRef: this.#userRef });
  }

  async subscribe(action) {
    console.info(`${LOG_PREFIX}subscribe`, action.nodeRef);
    this.#nodeRef = action.nodeRef;
    await this.reconnect();
  }

  async unsubscribe() {
    console.info(`${LOG_PREFIX}unsubscribe`);
    this.#nodeRef = null;
  }

  async joinCollaboration(action) {
    console.info(`${LOG_PREFIX}joinCollaboration`, action.nodeRef);
    this.#nodeRef = action.nodeRef;
    this.#collaborating = true;
    if (this.#isConnected()) {
      await this.#publish({
        type: actionTypes.COLLABORATOR_JOINED,
        userRef: this.#userRef,
        nodeRef: this.#nodeRef,
        ts: action.ts,
      });
      return;
    }

    if (!action.fromConnect) {
      await this.reconnect();
    }
  }

  async leaveCollaboration(action) {
    console.info(`${LOG_PREFIX}leaveCollaboration`, action.nodeRef);
    if (!this.#collaborating) {
      return;
    }

    this.#collaborating = false;
    await this.#publish({
      type: actionTypes.COLLABORATOR_LEFT,
      userRef: this.#userRef,
      nodeRef: action.nodeRef,
    });
  }

  async heartbeat(action) {
    if (!this.#collaborating) {
      await this.joinCollaboration({ nodeRef: action.nodeRef, ts: action.ts });
      return;
    }

    await this.#publish({
      type: actionTypes.HEARTBEAT,
      userRef: this.#userRef,
      nodeRef: this.#nodeRef,
      ts: action.ts,
    });
  }

  async test() {
    const action = {
      type: appActionTypes.ALERT_SENT,
      alert: {
        id: 'raven-test',
        type: 'info',
        message: 'Test alert from raven.',
      },
    };
    self.postMessage(action);
  }
}

const raven = new Raven();

self.onmessage = (event) => {
  const action = event.data || {};
  const method = action?.method || 'unknown';

  if (!raven[method]) {
    console.warn(`${LOG_PREFIX}unknown`, action);
    return;
  }

  raven[method](action).catch((e) => {
    console.error(`${LOG_PREFIX}onmessage/error`, action, e.message);
  });
};
