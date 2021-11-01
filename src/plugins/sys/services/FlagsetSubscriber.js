/* eslint-disable no-underscore-dangle */
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import FlagsetId from '@triniti/schemas/triniti/sys/FlagsetId';
import getKeyValuesFieldErrors from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';

export default class FlagsetSubscriber extends EventSubscriber {
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

    data.booleans = Object
      .entries(node.get('booleans', []))
      .map((param) => ({ key: param[0], value: { label: param[1].toString(), value: param[1] } }));

    data.floats = Object
      .entries(node.get('floats', []))
      .map((param) => ({ key: param[0], value: param[1] }));

    data.ints = Object
      .entries(node.get('ints', []))
      .map((param) => ({ key: param[0], value: param[1] }));

    data.strings = Object
      .entries(node.get('strings', []))
      .map((param) => ({ key: param[0], value: param[1] }));

    data.trinaries = Object
      .entries(node.get('trinaries', []))
      .map((param) => ({ key: param[0], value: param[1] }));
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
    } else {
      try {
        node.set('_id', FlagsetId.fromString(data.title));
      } catch (e) {
        formEvent.addError('title', `"${data.title}" is not a valid title.`);
      }
    }

    const booleanFlagsFieldError = getKeyValuesFieldErrors(data, 'booleans', node);
    if (booleanFlagsFieldError.hasError) {
      formEvent.addError('booleans', booleanFlagsFieldError.errors);
    }

    const floatFlagsFieldError = getKeyValuesFieldErrors(data, 'floats', node);
    if (floatFlagsFieldError.hasError) {
      formEvent.addError('floats', floatFlagsFieldError.errors);
    }

    const intFlagsFieldError = getKeyValuesFieldErrors(data, 'ints', node);
    if (intFlagsFieldError.hasError) {
      formEvent.addError('ints', intFlagsFieldError.errors);
    }

    const stringFlagsFieldError = getKeyValuesFieldErrors(data, 'strings', node);
    if (stringFlagsFieldError.hasError) {
      formEvent.addError('strings', stringFlagsFieldError.errors);
    }

    const trinaries = (data.trinaries
    || []).map(({ key, value }) => ({ key, value: parseInt(value, 10) || 0 }));
    const trinaryFlagsFieldError = getKeyValuesFieldErrors({ trinaries }, 'trinaries', node);
    if (trinaryFlagsFieldError.hasError) {
      formEvent.addError('trinaries', trinaryFlagsFieldError.errors);
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
      node.set('_id', FlagsetId.fromString(data.title));
    }

    node.clear('booleans');
    (data.booleans || []).forEach(({ key, value }) => node.addToMap('booleans', key, value.value));

    node.clear('floats');
    (data.floats || []).forEach(({ key, value }) => node.addToMap('floats', key, parseFloat(value)));

    node.clear('ints');
    (data.ints || []).forEach(({ key, value }) => node.addToMap('ints', key, parseInt(value, 10)));

    node.clear('strings');
    (data.strings || []).forEach(({ key, value }) => node.addToMap('strings', key, value));

    node.clear('trinaries');
    (data.trinaries || []).forEach(({ key, value }) => node.addToMap('trinaries', key, parseInt(value, 10) || 0));
  }

  getSubscribedEvents() {
    return {
      'triniti:sys:mixin:flagset.init_form': this.onInitForm,
      'triniti:sys:mixin:flagset.validate_form': this.onValidateForm,
      'triniti:sys:mixin:flagset.submit_form': this.onSubmitForm,
    };
  }
}
