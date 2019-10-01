import camelCase from 'lodash/camelCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import SponsorType from '@triniti/schemas/triniti/boost/enums/SponsorType';

export default class SponsorSubscriber extends EventSubscriber {
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

    ['title', 'permalink_html_head', 'permalink_badge', 'timeline_badge'].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });

    data.type = node.has('type')
      ? { label: node.get('type').toString(), value: node.get('type').toString() } : null;
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
        node.set('title', data.title);
      } catch (e) {
        formEvent.addError('title', e.message);
      }
    }

    if (data.type) {
      try {
        node.set('type', data.type ? SponsorType.create(data.type.value) : null);
      } catch (e) {
        formEvent.addError('type', e.message);
      }
    }

    ['permalink_html_head', 'permalink_badge', 'timeline_badge'].forEach((fieldName) => {
      if (data[camelCase(fieldName)]) {
        try {
          node.set('permalink_html_head', data[camelCase(fieldName)]);
        } catch (e) {
          formEvent.addError(camelCase(fieldName), e.message);
        }
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

    ['title', 'permalink_html_head', 'permalink_badge', 'timeline_badge'].forEach((fieldName) => {
      node.set(fieldName, data[camelCase(fieldName)]);
    });

    if (data.type && data.type.value) {
      node.set('type', SponsorType.create(data.type.value));
    } else {
      node.clear('type');
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:boost:mixin:sponsor.init_form': this.onInitForm,
      'triniti:boost:mixin:sponsor.validate_form': this.onValidateForm,
      'triniti:boost:mixin:sponsor.submit_form': this.onSubmitForm,
    };
  }
}
