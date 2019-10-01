import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class SwipeableSubscriber extends EventSubscriber {
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

    data.swipe = node.has('swipe') ? {
      label: node.get('swipe'),
      value: node.get('swipe'),
    } : null;
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (get(data, 'swipe.value')) {
      try {
        node.set('swipe', data.swipe.value);
      } catch (e) {
        formEvent.addError('swipe', e.message);
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

    node.set('swipe', get(data, 'swipe.value', null));
  }

  getSubscribedEvents() {
    return {
      'triniti:common:mixin:swipeable.init_form': this.onInitForm,
      'triniti:common:mixin:swipeable.validate_form': this.onValidateForm,
      'triniti:common:mixin:swipeable.submit_form': this.onSubmitForm,
    };
  }
}
