import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';

export default class PatchAssetsSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onValidateForm = this.onValidateForm.bind(this);
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

    error = getTextFieldError(data, 'display_title', node);
    if (error) {
      formEvent.addError('display_title', error);
    }

    if (get(data, 'credit.value')) {
      try {
        node.set('credit', get(data, 'credit.value'));
      } catch (e) {
        formEvent.addError('credit', e.message);
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:dam:mixin:patch-assets.validate_form': this.onValidateForm,
    };
  }
}
