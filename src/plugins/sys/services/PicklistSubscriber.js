/* eslint-disable no-underscore-dangle */
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import PicklistId from '@triniti/schemas/triniti/sys/PicklistId';

export default class PicklistSubscriber extends EventSubscriber {
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

    data.title = node.get('_id').toString();
    data.alphaSort = node.get('alpha_sort');
    data.allowOther = node.get('allow_other');
    data.options = node.get('options') || [];
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    if (!data.title) {
      formEvent.addError('title', 'Title is required');
    }

    if (data.title) {
      try {
        node.set('_id', PicklistId.fromString(data.title));
      } catch (e) {
        formEvent.addError('title', `"${data.title}" is not a valid title`);
      }
    }

    if (!formEvent.getProps().isCreateForm && data.options) {
      const optionArrayErrors = [];
      data.options.forEach((option, index) => {
        if (!option) {
          optionArrayErrors[index] = 'Option title is required.';
        }
      });

      if (optionArrayErrors.length) {
        formEvent.addError('options', optionArrayErrors);
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

    if (formEvent.getProps().isCreateForm) {
      node.set('_id', PicklistId.fromString(data.title));
      node.set('title', data.title);
    } else {
      node
        .set('alpha_sort', data.alphaSort)
        .set('allow_other', data.allowOther)
        .clear('options')
        .addToList('options', data.options);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:sys:mixin:picklist.init_form': this.onInitForm,
      'triniti:sys:mixin:picklist.validate_form': this.onValidateForm,
      'triniti:sys:mixin:picklist.submit_form': this.onSubmitForm,
    };
  }
}
