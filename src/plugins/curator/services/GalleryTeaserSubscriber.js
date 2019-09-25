import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class GalleryTeaserSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values.
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    data.targetRefs = [node.get('target_ref')];
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.targetRefs) {
      try {
        node.set('target_ref', data.targetRefs[0]);
      } catch (e) {
        formEvent.addError('targetRefs', e.message);
      }
    }
  }

  /**
   * Binds data from the redux form to the command.
   * This occurs AFTER a form has been submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const node = formEvent.getMessage();
    const { isCreateForm, target } = formEvent.getProps();

    if (node.isFrozen()) {
      return;
    }

    if (isCreateForm && target) {
      node
        .set('target_ref', NodeRef.fromNode(target))
        .set('image_ref', target.get('image_ref'))
        .set('title', target.get('title'));

      if (target.has('description')) {
        node.set('description', target.get('description'));
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:gallery-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:gallery-teaser.validate_form': this.onValidateForm,
      'triniti:curator:mixin:gallery-teaser.submit_form': this.onSubmitForm,
    };
  }
}
