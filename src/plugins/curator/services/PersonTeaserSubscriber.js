import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class PersonTeaserSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
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

    // data.targetRefs = [];
    // if (node.has('target_ref')) {
    //   data.targetRefs.push(node.get('target_ref'));
    // }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:person-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:person-teaser.submit_form': this.onSubmitForm,
    };
  }
}
