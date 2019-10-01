import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class HasPollSubscriber extends EventSubscriber {
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

    data.pollRefs = [];
    if (node.has('poll_ref')) {
      data.pollRefs.push(node.get('poll_ref'));
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

    if (data.pollRefs && data.pollRefs.length > 0) {
      try {
        node.set('poll_ref', data.pollRefs[0]);
      } catch (e) {
        formEvent.addError('pollRefs', e.message);
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

    node.clear('poll_ref');
    if (data.pollRefs && data.pollRefs.length > 0) {
      node.set('poll_ref', data.pollRefs[0] || null);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:apollo:mixin:has-poll.init_form': this.onInitForm,
      'triniti:apollo:mixin:has-poll.validate_form': this.onValidateForm,
      'triniti:apollo:mixin:has-poll.submit_form': this.onSubmitForm,
    };
  }
}
