import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class ConsistentReadEnricher extends EventSubscriber {
  constructor() {
    super();
    this.onEnrich = this.onEnrich.bind(this);
  }

  /**
   * Runs before the request is sent.
   *
   * @param {RequestEvent} requestEvent
   */
  onEnrich(requestEvent) {
    requestEvent.getMessage().set('consistent_read', true);
  }

  getSubscribedEvents() {
    return {
      'gdbots:ncr:mixin:get-node-request.enrich': this.onEnrich,
    };
  }
}
