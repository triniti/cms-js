import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class ShowtimesWidgetSubscriber extends EventSubscriber {
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
      'include_latest_episode',
      'include_latest_promo',
      'headline',
      'excerpt',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.imageRef = node.has('image_ref') ? node.get('image_ref').toString() : null;
    data.show = node.has('show') ? {
      label: node.get('show'),
      value: node.get('show'),
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

    let error = null;
    ['headline', 'excerpt'].forEach((fieldName) => {
      error = getTextFieldError(data, fieldName, node);
      if (error) {
        formEvent.addError(fieldName, error);
      }
    });

    if (get(data, 'show.value')) {
      try {
        node.set('show', data.show.value);
      } catch (e) {
        formEvent.addError('show', e.message);
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

    [
      'include_latest_episode',
      'include_latest_promo',
      'headline',
      'excerpt',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });

    node.set('image_ref', data.imageRef ? NodeRef.fromString(data.imageRef) : null);
    node.set('show', get(data, 'show.value', null));
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:showtimes-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:showtimes-widget.validate_form': this.onValidateForm,
      'triniti:curator:mixin:showtimes-widget.submit_form': this.onSubmitForm,
    };
  }
}
