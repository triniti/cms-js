import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import BigNumber from '@gdbots/pbj/well-known/BigNumber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';

export default class AssetSubscriber extends EventSubscriber {
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
      'credit_url',
      'cta_text',
      'cta_url',
      'description',
      'display_title',
      '_id',
      'linked_refs',
      'mime_type',
      'title',
    ].forEach((fieldName) => {
      data[camelCase(fieldName)] = node.get(fieldName);
    });

    data.fileSize = node.get('file_size').toNumber();

    data.credit = node.has('credit') ? {
      label: node.get('credit'),
      value: node.get('credit'),
    } : undefined;
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    let error = getTextAreaFieldError(data, 'description', node);
    if (error) {
      formEvent.addError('description', error);
    }

    [
      'credit_url',
      'cta_text',
      'cta_url',
      'display_title',
      'title',
    ].forEach((fieldName) => {
      error = getTextFieldError(data, camelCase(fieldName), node);
      if (error) {
        formEvent.addError(camelCase(fieldName), error);
      }
    });

    if (get(data, 'credit.value')) {
      try {
        node.set('credit', get(data, 'credit.value'));
      } catch (e) {
        formEvent.addError('credit', e.message);
      }
    }

    if (!data.mimeType) {
      formEvent.addError('mimeType', 'mime type is required');
    } else {
      try {
        node.set('mime_type', data.mimeType);
      } catch (e) {
        formEvent.addError('mimeType', e.message);
      }
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

    if (formEvent.hasErrors()) {
      return;
    }

    [
      'cta_text',
      'description',
      'display_title',
      'mime_type',
      'title',
    ].forEach((fieldName) => {
      if (data[camelCase(fieldName)]) {
        node.set(fieldName, data[camelCase(fieldName)]);
      } else {
        node.clear(fieldName);
      }
    });

    node.set('credit_url', data.creditUrl || null);
    node.set('credit', get(data, 'credit.value', null));
    node.set('cta_url', data.ctaUrl || null);

    node.set('file_size', new BigNumber(data.fileSize));

    node.clear('linked_refs');
    if (data.linkedRefs) {
      node.addToSet('linked_refs', data.linkedRefs);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:dam:mixin:asset.init_form': this.onInitForm,
      'triniti:dam:mixin:asset.validate_form': this.onValidateForm,
      'triniti:dam:mixin:asset.submit_form': this.onSubmitForm,
    };
  }
}
