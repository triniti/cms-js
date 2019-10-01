import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class HasPeopleSubscriber extends EventSubscriber {
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

    data.personRefs = node.get('person_refs', []);
    data.primaryPersonRefs = node.get('primary_person_refs', []);
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

    node
      .clear('person_refs')
      .clear('primary_person_refs')
      .addToSet('person_refs', data.personRefs || [])
      .addToSet('primary_person_refs', data.primaryPersonRefs || []);
  }

  getSubscribedEvents() {
    return {
      'triniti:people:mixin:has-people.init_form': this.onInitForm,
      'triniti:people:mixin:has-people.submit_form': this.onSubmitForm,
    };
  }
}
