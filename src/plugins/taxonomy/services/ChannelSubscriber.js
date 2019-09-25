import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

export default class ChannelSubscriber extends EventSubscriber {
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

    data.title = node.get('title');
    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    } else {
      try {
        node.set('title', data.title);
      } catch (e) {
        formEvent.addError('title', e.message);
      }
    }

    if (data.imageRef) {
      try {
        node.set('image_ref', NodeRef.fromString(data.imageRef));
      } catch (e) {
        formEvent.addError('imageRef', e.message);
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
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (node.isFrozen()) {
      return;
    }

    node.set('title', data.title);
    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);
  }

  getSubscribedEvents() {
    return {
      'triniti:taxonomy:mixin:channel.init_form': this.onInitForm,
      'triniti:taxonomy:mixin:channel.validate_form': this.onValidateForm,
      'triniti:taxonomy:mixin:channel.submit_form': this.onSubmitForm,
    };
  }
}
