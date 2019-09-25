import get from 'lodash/get';
import { getFormMeta } from 'redux-form';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getDatePickerFieldError from '@triniti/cms/components/date-picker-field/getDatePickerFieldError';

export default class TeaserableSubscriber extends EventSubscriber {
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

    data.orderDate = node.get('order_date');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    const redux = formEvent.getRedux();
    if (redux) {
      const fieldsMeta = getFormMeta(formEvent.getName())(redux.getState());
      if (get(fieldsMeta, 'orderDate.touched')) {
        const error = getDatePickerFieldError(data, 'orderDate', node);
        if (error) {
          formEvent.addError('orderDate', error);
        }
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

    node.set('order_date', data.orderDate || null);
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:teaserable.init_form': this.onInitForm,
      'triniti:curator:mixin:teaserable.validate_form': this.onValidateForm,
      'triniti:curator:mixin:teaserable.submit_form': this.onSubmitForm,
    };
  }
}
