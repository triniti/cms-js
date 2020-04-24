import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class ChannelTeaserSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
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

    data.targetRefs = [];
    if (node.has('target_ref')) {
      data.targetRefs.push(node.get('target_ref'));
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

    if (data.targetRefs && data.targetRefs.length) {
      try {
        node.set('target_ref', data.targetRefs[0]);
      } catch (e) {
        formEvent.addError('targetRefs', e.message);
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:channel-teaser.init_form': this.onInitForm,
      'triniti:curator:mixin:channel-teaser.validate_form': this.onValidateForm,
    };
  }
}
