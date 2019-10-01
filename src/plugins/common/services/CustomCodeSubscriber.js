import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class CustomCodeSubscriber extends EventSubscriber {
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

    data.htmlHead = node.getFromMap('custom_code', 'html_head');
    data.afterHeader = node.getFromMap('custom_code', 'after_header');
    data.afterFooter = node.getFromMap('custom_code', 'after_footer');
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

    node.addToMap('custom_code', 'html_head', data.htmlHead);
    node.addToMap('custom_code', 'after_header', data.afterHeader);
    node.addToMap('custom_code', 'after_footer', data.afterFooter);
  }

  getSubscribedEvents() {
    return {
      'triniti:common:mixin:custom-code.init_form': this.onInitForm,
      'triniti:common:mixin:custom-code.submit_form': this.onSubmitForm,
    };
  }
}
