import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class SponsorableSubscriber extends EventSubscriber {
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

    data.sponsorRefs = [];
    if (node.has('sponsor_ref')) {
      data.sponsorRefs.push(node.get('sponsor_ref'));
    }
  }

  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (data.sponsorRefs && data.sponsorRefs.length) {
      try {
        node.set('sponsor_ref', data.sponsorRefs[0]);
      } catch (e) {
        formEvent.addError('sponsorRefs', e.message);
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

    node.clear('sponsor_ref');
    if (data.sponsorRefs && data.sponsorRefs.length) {
      node.set('sponsor_ref', data.sponsorRefs[0]);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:boost:mixin:sponsorable.init_form': this.onInitForm,
      'triniti:boost:mixin:sponsorable.validate_form': this.onValidateForm,
      'triniti:boost:mixin:sponsorable.submit_form': this.onSubmitForm,
    };
  }
}
