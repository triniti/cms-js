import AppV1 from '@gdbots/schemas/gdbots/contexts/AppV1.js';

export default class MessageBinder {
  /**
   * @param {App} app
   */
  constructor(app) {
    this.ctxApp = AppV1.create()
      .set('vendor', app.getParameter('app_vendor'))
      .set('name', app.getParameter('app_name'))
      .set('version', app.getParameter('app_version'))
      .set('build', app.getParameter('app_build'))
      .freeze();
    this.app = app;
  }

  /**
   * Binds the current app to all command and requests.
   * This gives us precise detail about what client app,
   * version, etc. that is posting messages to our api.
   *
   * @param {PbjxEvent} pbjxEvent
   */
  bindCtx(pbjxEvent) {
    const message = pbjxEvent.getMessage();
    if (message.isFrozen()) {
      return;
    }

    if (!message.has('ctx_app')) {
      message.set('ctx_app', this.ctxApp);
    }
  }
}
