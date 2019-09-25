import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import AppV1 from '@gdbots/schemas/gdbots/contexts/AppV1';

export default class CtxBinder extends EventSubscriber {
  /**
   * @param {Object} container
   */
  constructor(container) {
    super();
    const app = AppV1.create()
      .set('vendor', container.get('app_vendor'))
      .set('name', container.get('app_name'))
      .set('version', container.get('app_version'))
      .set('build', container.get('app_build'))
      .freeze();
    Object.defineProperty(this, 'app', { value: app });
    this.bindApp = this.bindApp.bind(this);
  }

  /**
   * Binds the current app to all command and requests.
   * This gives us precise detail about what client app,
   * version, etc. that is posting messages to our api.
   *
   * @param {PbjxEvent} pbjxEvent
   */
  bindApp(pbjxEvent) {
    const message = pbjxEvent.getMessage();
    if (message.isFrozen() || message.has('ctx_app')) {
      return;
    }

    message.set('ctx_app', this.app);
  }

  getSubscribedEvents() {
    return {
      'gdbots:pbjx:mixin:command.bind': this.bindApp,
      'gdbots:pbjx:mixin:request.bind': this.bindApp,
    };
  }
}
