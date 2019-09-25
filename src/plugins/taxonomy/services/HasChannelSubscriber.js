import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class HasChannelSubscriber extends EventSubscriber {
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

    data.channelRefs = [];
    if (node.has('channel_ref')) {
      data.channelRefs.push(node.get('channel_ref'));
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

    node.clear('channel_ref');
    if (data.channelRefs && data.channelRefs.length) {
      node.set('channel_ref', data.channelRefs[0]);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:taxonomy:mixin:has-channel.init_form': this.onInitForm,
      'triniti:taxonomy:mixin:has-channel.submit_form': this.onSubmitForm,
    };
  }
}
