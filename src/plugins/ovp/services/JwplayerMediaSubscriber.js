import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class JwplayerMediaSubscriber extends EventSubscriber {
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

    data.jwplayerMediaId = node.get('jwplayer_media_id');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    const error = getTextFieldError(data, 'jwplayerMediaId', node);
    if (error) {
      formEvent.addError('jwplayerMediaId', error);
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

    if (data.jwplayerMediaId) {
      node.set('jwplayer_media_id', data.jwplayerMediaId);
    } else {
      node.clear('jwplayer_media_id');
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:ovp.jwplayer:mixin:has-media.init_form': this.onInitForm,
      'triniti:ovp.jwplayer:mixin:has-media.validate_form': this.onValidateForm,
      'triniti:ovp.jwplayer:mixin:has-media.submit_form': this.onSubmitForm,
    };
  }
}
