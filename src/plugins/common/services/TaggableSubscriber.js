import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getKeyValuesFieldErrors from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';

export default class TaggableSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
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
    data.tags = [];

    Object.entries(node.get('tags') || {}).forEach((tag) => data.tags.push({ key: tag[0], value: tag[1] }));
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    const { errors, hasError } = getKeyValuesFieldErrors(data, 'tags', node);
    if (hasError) {
      formEvent.addError('tags', errors);
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

    node.clear('tags');
    if (data.tags) {
      data.tags.forEach(({ key, value }) => node.addToMap('tags', key, value));
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:common:mixin:taggable.init_form': this.onInitForm,
      'gdbots:common:mixin:taggable.validate_form': this.onValidateForm,
      'gdbots:common:mixin:taggable.submit_form': this.onSubmitForm,
    };
  }
}
