import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class MedialiveChannelSubscriber extends EventSubscriber {
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

    data.medialiveChannelArn = node.get('medialive_channel_arn');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    const error = getTextFieldError(data, 'medialiveChannelArn', node);
    if (error) {
      formEvent.addError('medialiveChannelArn', error);
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

    if (data.medialiveChannelArn) {
      node.set('medialive_channel_arn', data.medialiveChannelArn);
    } else {
      node.clear('medialive_channel_arn');
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:ovp.medialive:mixin:has-channel.init_form': this.onInitForm,
      'triniti:ovp.medialive:mixin:has-channel.validate_form': this.onValidateForm,
      'triniti:ovp.medialive:mixin:has-channel.submit_form': this.onSubmitForm,
    };
  }
}
