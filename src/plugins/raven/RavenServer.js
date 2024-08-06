import { serviceIds } from '@triniti/cms/plugins/raven/constants.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';

const LOG_PREFIX = `raven_server.v${APP_VERSION}/`;

export default class RavenServer {
  #app = null;
  #collaborating = false;

  constructor(app) {
    this.#app = app;
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
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}/joinCollaboration/error`, action.nodeRef, e.message);
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
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}/leaveCollaboration/error`, action.nodeRef, e.message);
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
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      data = await response.json();
    } catch (e) {
      console.error(`${LOG_PREFIX}/heartbeat/error`, action.nodeRef, e.message);
    }

    return data;
  }
}
