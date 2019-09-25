import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class EmailNotificationSubscriber extends EventSubscriber {
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

    ['sender', 'template', 'subject'].forEach((field) => {
      if (node.get(field)) {
        const value = node.get(field);
        data[field] = { label: value, value };
      }
    });

    if (node.get('lists')) {
      const value = node.get('lists');
      data.lists = value.map((item) => ({ label: item, value: item }));
    }
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    ['sender', 'template', 'subject'].forEach((field) => {
      if (get(data, `${field}.value`)) {
        try {
          node.set(field, get(data, `${field}.value`));
        } catch (e) {
          formEvent.addError(field, e.message);
        }
      }
    });

    if (data.lists) {
      try {
        node.addToSet('lists', data.lists.map((list) => list.value));
      } catch (e) {
        formEvent.addError('lists', e.message);
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

    ['sender', 'template', 'subject'].forEach((field) => {
      if (node.has(field) || get(data, `${field}.value`)) {
        node.set(field, get(data, `${field}.value`));
      }
    });

    if (node.has('lists') || data.lists) {
      node.clear('lists');
      node.addToSet('lists', data.lists.map((list) => list.value));
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:notify:mixin:email-notification.init_form': this.onInitForm,
      'triniti:notify:mixin:email-notification.validate_form': this.onValidateForm,
      'triniti:notify:mixin:email-notification.submit_form': this.onSubmitForm,
    };
  }
}
