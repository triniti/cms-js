import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class TetrisWidgetSubscriber extends EventSubscriber {
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

    data.layout = node.has('layout') ? {
      label: node.get('layout'),
      value: node.get('layout'),
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

    if (get(data, 'layout.value')) {
      try {
        node.set('layout', data.layout.value);
      } catch (e) {
        formEvent.addError('layout', e.message);
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

    node.set('layout', get(data, 'layout.value', null));
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:tetris-widget.init_form': this.onInitForm,
      'triniti:curator:mixin:tetris-widget.validate_form': this.onValidateForm,
      'triniti:curator:mixin:tetris-widget.submit_form': this.onSubmitForm,
    };
  }
}
