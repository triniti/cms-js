import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class ImageAssetSubscriber extends EventSubscriber {
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

    data.width = node.get('width');
    data.height = node.get('height');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.width) {
      try {
        node.set('width', data.width);
      } catch (e) {
        formEvent.addError('width', e.message);
      }
    }

    if (data.height) {
      try {
        node.set('height', data.height);
      } catch (e) {
        formEvent.addError('height', e.message);
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

    if (formEvent.hasErrors()) {
      return;
    }

    node
      .set('width', data.width)
      .set('height', data.height);
  }

  getSubscribedEvents() {
    return {
      'triniti:dam:mixin:image-asset.init_form': this.onInitForm,
      'triniti:dam:mixin:image-asset.validate_form': this.onValidateForm,
      'triniti:dam:mixin:image-asset.submit_form': this.onSubmitForm,
    };
  }
}
