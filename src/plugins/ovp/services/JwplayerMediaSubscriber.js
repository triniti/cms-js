import camelCase from 'lodash/camelCase';
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

    [
      'jwplayer_media_id',
      'jwplayer_sync_enabled',
      'jwplayer_synced_at',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    ['jwplayerMediaId', 'jwplayerSyncedAt'].forEach((fieldName) => {
      const error = getTextFieldError(data, fieldName, node);
      if (error) {
        formEvent.addError(fieldName, error);
      }
    });
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

    ['jwplayer_media_id', 'jwplayer_synced_at'].forEach((fieldName) => {
      node.set(fieldName, data[camelCase(fieldName)] || null);
    });

    node.set('jwplayer_sync_enabled', data.jwplayerSyncEnabled);
  }

  getSubscribedEvents() {
    return {
      'triniti:ovp.jwplayer:mixin:has-media.init_form': this.onInitForm,
      'triniti:ovp.jwplayer:mixin:has-media.validate_form': this.onValidateForm,
      'triniti:ovp.jwplayer:mixin:has-media.submit_form': this.onSubmitForm,
    };
  }
}
