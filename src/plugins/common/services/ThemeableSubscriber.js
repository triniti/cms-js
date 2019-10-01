import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class ThemeableSubscriber extends EventSubscriber {
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

    data.theme = node.has('theme') ? {
      label: node.get('theme'),
      value: node.get('theme'),
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

    if (get(data, 'theme.value')) {
      try {
        node.set('theme', data.theme.value);
      } catch (e) {
        formEvent.addError('theme', e.message);
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

    node.set('theme', get(data, 'theme.value', null));
  }

  getSubscribedEvents() {
    return {
      'triniti:common:mixin:themeable.init_form': this.onInitForm,
      'triniti:common:mixin:themeable.validate_form': this.onValidateForm,
      'triniti:common:mixin:themeable.submit_form': this.onSubmitForm,
    };
  }
}
