import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class AlertWidgetSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
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

    data.dismissible = node.get('dismissible');
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

    if (!formEvent.getProps().isCreateForm) {
      node.set('dismissible', data.dismissible);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:alert-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:alert-widget.submit_form': this.onSubmitForm,
    };
  }
}
