import get from 'lodash/get';
import { getFormMeta } from 'redux-form';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getDatePickerFieldError from '@triniti/cms/components/date-picker-field/getDatePickerFieldError';

export default class ExpirableSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    data.expiresAt = node.get('expires_at');
  }

  /**
   * This if the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    const redux = formEvent.getRedux();
    if (redux) {
      const fieldsMeta = getFormMeta(formEvent.getName())(redux.getState());
      if (get(fieldsMeta, 'expiresAt.touched')) {
        const error = getDatePickerFieldError(data, 'expiresAt', node);
        if (error) {
          formEvent.addError('expiresAt', error);
        }
      }
    }
  }

  /**
   * Binds data from redux form to the command
   * This happens AFTER the form is submitted
   * but before the command is dispatched.
   *
   * @param {FormEvent} formEvent
   */
  onSubmitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    node.set('expires_at', data.expiresAt || null);
  }

  getSubscribedEvents() {
    return {
      'gdbots:ncr:mixin:expirable.init_form': this.onInitForm,
      'gdbots:ncr:mixin:expirable.validate_form': this.onValidateForm,
      'gdbots:ncr:mixin:expirable.submit_form': this.onSubmitForm,
    };
  }
}
