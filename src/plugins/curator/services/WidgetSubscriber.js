import camelCase from 'lodash/camelCase';
import isUndefined from 'lodash/isUndefined';
import snakeCase from 'lodash/snakeCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class WidgetSubscriber extends EventSubscriber {
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

    [
      'header_text',
      'partner_text',
      'partner_url',
      'post_render_code',
      'pre_render_code',
      'show_border',
      'show_header',
      'title',
      'view_all_text',
      'view_all_url',
    ].forEach((fieldName) => {
      if (node.has(fieldName)) {
        data[camelCase(fieldName)] = node.get(fieldName);
      }
    });
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

    [
      'headerText',
      'partnerText',
      'partnerUrl',
      'title',
      'viewAllText',
      'viewAllUrl',
    ].forEach((fieldName) => {
      if (data[fieldName]) {
        const error = getTextFieldError(data, fieldName, node);
        if (error) {
          formEvent.addError(fieldName, error);
        }
      }
    });

    ['postRenderCode', 'preRenderCode'].forEach((fieldName) => {
      if (data[fieldName]) {
        try {
          node.set(snakeCase(fieldName), data[fieldName]);
        } catch (e) {
          formEvent.addError(fieldName, e.message);
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

    [
      'header_text',
      'partner_text',
      'partner_url',
      'post_render_code',
      'pre_render_code',
      'title',
      'view_all_text',
      'view_all_url',
    ].forEach((fieldName) => {
      node.set(fieldName, data[camelCase(fieldName)] || null);
    });

    [ // booleans
      'show_border',
      'show_header',
    ].forEach((fieldName) => {
      const value = data[camelCase(fieldName)];
      node.set(fieldName, isUndefined(value) ? null : value);
    });
  }

  getSubscribedEvents() {
    return {
      'triniti:curator:mixin:widget.init_form': this.onInitForm,
      'triniti:curator:mixin:widget.validate_form': this.onValidateForm,
      'triniti:curator:mixin:widget.submit_form': this.onSubmitForm,
    };
  }
}
