import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class CarouselWidgetSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
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
      'show_captions',
      'show_controls',
      'show_position_indicators',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
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

    if (!formEvent.getProps().isCreateForm) {
      [
        'show_captions',
        'show_controls',
        'show_position_indicators',
      ].forEach((fieldName) => {
        const value = data[camelCase(fieldName)];
        node.set(fieldName, isUndefined(value) ? null : value);
      });
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:carousel-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:carousel-widget.submit_form': this.onSubmitForm,
    };
  }
}
