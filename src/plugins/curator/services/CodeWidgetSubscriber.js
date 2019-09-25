import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class CodeWidgetSubscriber extends EventSubscriber {
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

    if (node.has('code')) {
      data.code = node.get('code');
    }
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.code) {
      try {
        node.set('code', data.code);
      } catch (e) {
        formEvent.addError('code', e.message);
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

    node.set('code', data.code);
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:code-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:code-widget.validate_form': this.onValidateForm,
      'triniti:curator:mixin:code-widget.submit_form': this.onSubmitForm,
    };
  }
}
