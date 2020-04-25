import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class AssetTeaserSubscriber extends EventSubscriber {
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

    data.targetRef = node.get('target_ref').toString();
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.targetRef) {
      try {
        node.set('target_ref', NodeRef.fromString(data.targetRef));
      } catch (e) {
        formEvent.addError('targetRef', e.message);
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

    if (isCreateForm && target && target.schema().hasMixin('triniti:dam:mixin:image-asset')) {
      node.set('image_ref', NodeRef.fromNode(target));
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:asset-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:asset-teaser.validate_form': this.onValidateForm,
      'triniti:curator:mixin:asset-teaser.submit_form': this.onSubmitForm,
    };
  }
}
