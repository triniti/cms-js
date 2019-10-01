import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import { formRules } from '../constants';

export default class HeadlineFragmentsSubscriber extends EventSubscriber {
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

    const hf = node.get('hf', []);
    while (hf.length < 3) {
      hf.push('');
    }

    data.hf = hf.map((text, index) => {
      const sizeValue = node.get('hf_sizes', [])[index];
      const styleValue = node.get('hf_styles', [])[index];
      const defaultSizeLabel = index === 0 ? 'M' : 'XL';
      const defaultSizeValue = get(formRules.HF_SIZES_OPTIONS.find(({ label }) => label === defaultSizeLabel), 'value');

      return {
        text,
        size: {
          label: sizeValue
            ? get(formRules.HF_SIZES_OPTIONS.find(({ value }) => value === sizeValue), 'label', defaultSizeLabel)
            : defaultSizeLabel,
          value: sizeValue || defaultSizeValue,
        },
        style: {
          label: styleValue
            ? get(formRules.HF_STYLES_OPTIONS.find(({ value }) => value === styleValue), 'label', 'UPPERCASE')
            : 'UPPERCASE',
          value: styleValue || 'uppercase',
        },
      };
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
      const hf = (data.hf || []).filter(({ text }) => text !== '');
      node
        .clear('hf')
        .addToList('hf', hf.map(({ text }) => text))
        .clear('hf_styles')
        .addToList('hf_styles', hf.map(({ style: { value } }) => value))
        .clear('hf_sizes')
        .addToList('hf_sizes', hf.map(({ size: { value } }) => value));
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:news:mixin:headline-fragments.init_form': this.onInitForm,
      'triniti:news:mixin:headline-fragments.submit_form': this.onSubmitForm,
    };
  }
}
