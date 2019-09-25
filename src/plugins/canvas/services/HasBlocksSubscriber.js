import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import { convertToCanvasBlocks } from '@triniti/cms/plugins/blocksmith/utils';

export default class HasBlocksSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   * Binds data from the block editor to the command.
   * This occurs AFTER a form has been submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const node = formEvent.getMessage();
    if (formEvent.getProps().blocksmithState && formEvent.getProps().blocksmithState.editorState) {
      const blocks = convertToCanvasBlocks(formEvent.getProps().blocksmithState.editorState);
      node.clear('blocks');
      if (blocks) {
        node.addToList('blocks', blocks);
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:canvas:mixin:has-blocks.submit_form': this.onSubmitForm,
    };
  }
}
