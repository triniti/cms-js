import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import PrimaryImageRequired from '@triniti/cms/plugins/ncr/exceptions/PrimaryImageRequired.js';

export default class PublishNodeValidator {
  /**
   * @param {App} app
   */
  constructor(app) {
    this.app = app;
  }

  validate(pbjxEvent) {
    this.validateImageRef(pbjxEvent);
  }

  /**
   * Ensure a publishable node has an image_ref when being published.
   *
   * @param {PbjxEvent} pbjxEvent
   */
  validateImageRef(pbjxEvent) {
    const command = pbjxEvent.getMessage();
    const node = this.app.select(getNode, command.get('node_ref'));
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
}
