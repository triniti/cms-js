import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class AppSubscriber extends EventSubscriber {
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
    data.status = node.get('status');
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
    }

    if (data.title) {
      try {
        node.set('title', data.title);
      } catch (e) {
        formEvent.addError('title', e.message);
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
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:app.init_form': this.onInitForm,
      'gdbots:iam:mixin:app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:app.submit_form': this.onSubmitForm,
    };
  }
}
