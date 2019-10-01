import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import PrimaryImageRequired from '../exceptions/PrimaryImageRequired';

export default class PublishNodeValidator extends EventSubscriber {
  constructor() {
    super();
    this.validateImageRef = this.validateImageRef.bind(this);
  }

  /**
   * Ensure a publishable node has an image_ref when being published.
   *
   * @param {PbjxEvent} pbjxEvent
   */
  validateImageRef(pbjxEvent) {
    const command = pbjxEvent.getMessage();
    const state = pbjxEvent.getRedux().getState();

    const node = getNode(state, command.get('node_ref'));
    if (!node) {
      return;
    }

    if (!node.schema().hasField('seo_image_ref')) {
      return;
    }

    if (!node.has('image_ref')) {
      throw new PrimaryImageRequired();
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:ncr:mixin:publish-node.validate': this.validateImageRef,
    };
  }
}
