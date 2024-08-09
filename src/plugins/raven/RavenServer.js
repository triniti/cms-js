import base64 from 'base-64';
import utf8 from 'utf8';
import { serviceIds } from '@triniti/cms/plugins/raven/constants.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';

const LOG_PREFIX = `raven_server.v${APP_VERSION}/`;

export default class RavenServer {
  #app = null;
  #collaborating = false;
  #prevErrorMessage = null;

  constructor(app) {
    this.#app = app;
    this.onError = this.onError.bind(this);
    window.addEventListener('error', this.onError);
    window.addEventListener('blocksmith.error', this.onError);
  }

  isEnabled() {
    return this.#app.getParameter(serviceIds.RAVEN_SERVER_ENABLED);
  }

  async disconnect() {
    this.#collaborating = false;
  }

  async unsubscribe() {
    this.#collaborating = false;
  }

  async joinCollaboration(action) {
    let data = { ok: false };
    if (!this.isEnabled()) {
      return data;
    }

    if (this.#collaborating) {
      return data;
    }

    console.info(`${LOG_PREFIX}joinCollaboration`, action.nodeRef);
    this.#collaborating = true;

    try {
      const formData = new FormData();
      formData.append('node_ref', action.nodeRef);
      const response = await fetch(`${API_ENDPOINT}/raven/join-collaboration/`, {
        headers: {
          Authorization: `Bearer ${this.#app.select(getAccessToken)}`,
        },
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}joinCollaboration/error`, action.nodeRef, e.message);
    }

    return data;
  }

  async leaveCollaboration(action) {
    let data = { ok: false };
    if (!this.isEnabled()) {
      return data;
    }

    if (!this.#collaborating) {
      return data;
    }

    console.info(`${LOG_PREFIX}leaveCollaboration`, action.nodeRef);
    this.#collaborating = false;

    try {
      const formData = new FormData();
      formData.append('node_ref', action.nodeRef);
      const response = await fetch(`${API_ENDPOINT}/raven/leave-collaboration/`, {
        headers: {
          Authorization: `Bearer ${this.#app.select(getAccessToken)}`,
        },
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}leaveCollaboration/error`, action.nodeRef, e.message);
    }

    return data;
  }

  async heartbeat(action) {
    let data = { ok: false };
    if (!this.isEnabled()) {
      return data;
    }

    console.info(`${LOG_PREFIX}heartbeat`, action.nodeRef);

    try {
      const formData = new FormData();
      formData.append('node_ref', action.nodeRef);
      const response = await fetch(`${API_ENDPOINT}/raven/heartbeat/`, {
        headers: {
          Authorization: `Bearer ${this.#app.select(getAccessToken)}`,
        },
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}heartbeat/error`, action.nodeRef, e.message);
    }

    return data;
  }

  /**
   * @param {ErrorEvent|CustomEvent} evt
   */
  onError(evt) {
    if (!this.isEnabled()) {
      return;
    }

    const event = evt.detail || evt;
    const error = {
      name: evt.type || evt.name || event.name,
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || event.stack || null,
    };

    if (window.location.hostname === 'localhost') {
      return;
    }

    if (this.#prevErrorMessage === error.message) {
      return;
    }

    this.#prevErrorMessage = error.message;
    console.error(`${LOG_PREFIX}onError`, evt, error);

    const data = {
      ctx_app: {
        vendor: this.#app.getParameter('app_vendor'),
        name: this.#app.getParameter('app_name'),
        version: this.#app.getParameter('app_version'),
        build: this.#app.getParameter('app_build'),
      },
      request_uri: window.location.href,
      error,
    };

    let body;
    try {
      body = base64.encode(utf8.encode(JSON.stringify(data)));
    } catch (e) {
      console.error(`${LOG_PREFIX}onError/encode_failed`, data, e.message);
      return;
    }

    fetch(`${API_ENDPOINT}/raven/errors/`, {
      headers: {
        Authorization: `Bearer ${this.#app.select(getAccessToken)}`,
      },
      method: 'POST',
      body,
    }).then().catch((e) => {
      console.error(`${LOG_PREFIX}onError/post_failed`, data, e.message);
    });
  }
}
