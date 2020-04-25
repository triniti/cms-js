import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class PlaylistWidgetSubscriber extends EventSubscriber {
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

    data.autoplay = node.get('autoplay');
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

    node.set('autoplay', data.autoplay);
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:playlist-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:playlist-widget.submit_form': this.onSubmitForm,
    };
  }
}
