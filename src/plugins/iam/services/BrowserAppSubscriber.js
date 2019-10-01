import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class BrowserAppSubscriber extends EventSubscriber {
  constructor() {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onWarnForm = this.onWarnForm.bind(this);
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

    ['fcm_api_key', 'fcm_project_id', 'fcm_sender_id', 'fcm_web_api_key'].forEach((field) => {
      const fieldName = camelCase(field);

      if (node.has(field)) {
        data[fieldName] = node.get(field);
      }
    });
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const data = formEvent.getData();

    if (!get(data, 'fcmApiKey')) {
      return;
    }

    if (get(data, 'fcmApiKey').length < 255) {
      formEvent.addWarning('fcmApiKey', 'Make sure the value entered is encrypted');
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

    if (!formEvent.getProps().isCreateForm) {
      let error;
      // Fields using TextField component
      ['fcm_project_id', 'fcm_sender_id', 'fcm_web_api_key'].forEach((fieldName) => {
        error = getTextFieldError(data, camelCase(fieldName), node);
        if (error) {
          formEvent.addError(camelCase(fieldName), error);
        }
      });

      error = getTextAreaFieldError(data, 'fcmApiKey', node);
      if (error) {
        formEvent.addError('fcmApiKey', error);
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

    if (!formEvent.getProps().isCreateForm) {
      ['fcm_api_key', 'fcm_project_id', 'fcm_sender_id', 'fcm_web_api_key'].forEach((field) => {
        const fieldName = camelCase(field);

        if (get(data, fieldName) || node.has(field)) {
          node.set(field, get(data, fieldName) || null);
        }
      });
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:browser-app.init_form': this.onInitForm,
      'gdbots:iam:mixin:browser-app.warn_form': this.onWarnForm,
      'gdbots:iam:mixin:browser-app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:browser-app.submit_form': this.onSubmitForm,
    };
  }
}
