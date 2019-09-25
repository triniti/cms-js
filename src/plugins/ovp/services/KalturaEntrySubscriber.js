import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import Microtime from '@gdbots/pbj/well-known/Microtime';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class KalturaEntrySubscriber extends EventSubscriber {
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
    const syncedAt = node.get('kaltura_synced_at') ? Microtime.fromString(String(`${node.get('kaltura_synced_at')}000000`)) : null;

    data.kalturaEntryId = node.get('kaltura_entry_id');
    data.kalturaPartnerId = node.get('kaltura_partner_id');
    data.kalturaSyncEnabled = node.get('kaltura_sync_enabled');
    data.kalturaSyncedAt = syncedAt ? syncedAt.toMoment().format('MMM DD, YYYY hh:mm A') : '';
    data.kalturaMp4Url = node.get('kaltura_mp4_url');
    data.kalturaMetadata = node.get('kaltura_metadata') ? JSON.stringify(node.get('kaltura_metadata'), null, 2) : '';
    data.kalturaFlavors = node.get('kaltura_flavors') ? JSON.stringify(node.get('kaltura_flavors'), null, 2) : '';
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    let error = getTextFieldError(data, 'kalturaMp4Url', node, 'kaltura_mp4_url'); // does not camelCase as expected
    if (error) {
      formEvent.addError('kalturaMp4Url', error);
    }

    ['kalturaEntryId', 'kalturaPartnerId'].forEach((fieldName) => {
      error = getTextFieldError(data, fieldName, node);
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

    if (data.kalturaEntryId) {
      node.set('kaltura_entry_id', data.kalturaEntryId);
    }

    if (data.kalturaPartnerId) {
      node.set('kaltura_partner_id', data.kalturaPartnerId);
    }

    if (data.kalturaSyncEnabled) {
      node.set('kaltura_sync_enabled', data.kalturaSyncEnabled);
    }

    if (data.kalturaSyncedAt) {
      const microtime = Microtime.fromDate(data.kalturaSyncedAt).toString();
      node.set('kaltura_synced_at', Number(microtime.slice(0, 10)));
    }

    if (data.kalturaMp4Url) {
      node.set('kaltura_mp4_url', data.kalturaMp4Url);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:ovp.kaltura:mixin:has-entry.init_form': this.onInitForm,
      'triniti:ovp.kaltura:mixin:has-entry.validate_form': this.onValidateForm,
      'triniti:ovp.kaltura:mixin:has-entry.submit_form': this.onSubmitForm,
    };
  }
}
