import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class CategorizableSubscriber extends EventSubscriber {
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
    data.categoryRefs = node.get('category_refs', []);
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

    node.clear('category_refs').addToSet('category_refs', data.categoryRefs || []);
  }

  getSubscribedEvents() {
    return {
      'triniti:taxonomy:mixin:categorizable.init_form': this.onInitForm,
      'triniti:taxonomy:mixin:categorizable.submit_form': this.onSubmitForm,
    };
  }
}
