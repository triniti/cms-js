import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class VanityUrlableSubscriber extends EventSubscriber {
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

    data.redirectRefs = [];
    if (node.has('redirect_ref')) {
      data.redirectRefs.push(node.get('redirect_ref'));
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

    if (data.redirectRefs && data.redirectRefs.length) {
      try {
        node.set('redirect_ref', data.redirectRefs[0]);
      } catch (e) {
        formEvent.addError('redirectRefs', e.message);
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

    node.clear('redirect_ref');
    if (data.redirectRefs && data.redirectRefs.length) {
      node.set('redirect_ref', data.redirectRefs[0]);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:sys:mixin:vanity-urlable.init_form': this.onInitForm,
      'triniti:sys:mixin:vanity-urlable.validate_form': this.onValidateForm,
      'triniti:sys:mixin:vanity-urlable.submit_form': this.onSubmitForm,
    };
  }
}
