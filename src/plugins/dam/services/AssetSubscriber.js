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

    ['_id', 'title', 'description', 'mime_type', 'linked_refs'].forEach((fieldName) => {
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

    let error = getTextAreaFieldError(data, 'description', node);
    if (error) {
      formEvent.addError('description', error);
    }

    error = getTextFieldError(data, 'title', node);
    if (error) {
      formEvent.addError('title', error);
    }

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (get(data, 'credit.value')) {
      try {
        node.set('credit', get(data, 'credit.value'));
      } catch (e) {
        formEvent.addError('credit', e.message);
      }
    }

    if (!data.mimeType) {
      formEvent.addError('mimeType', 'mime type is required');
    }

    if (data.mimeType) {
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

    ['title', 'description', 'mime_type'].forEach((fieldName) => {
      node.set(fieldName, data[camelCase(fieldName)]);
    });

    node.set('credit', get(data, 'credit.value', null));

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
