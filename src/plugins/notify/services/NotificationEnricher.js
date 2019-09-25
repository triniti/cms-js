import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

export default class NotificationEnricher extends EventSubscriber {
  constructor() {
    super();
    this.enrichTitle = this.enrichTitle.bind(this);
  }

  /**
   * Sets the Notification title field to the content_ref title
   * if the field is empty
   *
   * @param {PbjxEvent} event
   */
  enrichTitle(event) {
    const message = event.getMessage();
    if (message.has('title') || !message.has('content_ref')) {
      return;
    }

    const content = getNode(event.getRedux().getState(), message.get('content_ref'));
    if (content) {
      message.set('title', content.get('title'));
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:notify:mixin:notification.enrich': this.enrichTitle,
    };
  }
}
