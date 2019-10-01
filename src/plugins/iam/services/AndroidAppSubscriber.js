import camelCase from 'lodash/camelCase';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import get from 'lodash/get';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';

export default class AndroidAppSubscriber extends EventSubscriber {
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

    ['azure_notification_hub_connection', 'azure_notification_hub_name', 'fcm_api_key'].forEach((field) => {
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

    if (!get(data, 'azureNotificationHubConnection') || !get(data, 'fcmApiKey')) {
      return;
    }

    ['azureNotificationHubConnection', 'fcmApiKey'].forEach((fieldName) => {
      if (data[fieldName].length < 200) {
        formEvent.addWarning(
          fieldName,
          'Encrypted value should be longer than what currently entered. Make sure the string is encrypted',
        );
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

    if (!formEvent.getProps().isCreateForm && get(data, 'azureNotificationHubName')) {
      const error = getTextFieldError(data, 'azureNotificationHubName', node);

      if (error) {
        formEvent.addError('azureNotificationHubName', error);
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
      ['azure_notification_hub_connection', 'azure_notification_hub_name', 'fcm_api_key'].forEach((field) => {
        const fieldName = camelCase(field);

        if (get(data, fieldName) || node.has(field)) {
          node.set(field, get(data, fieldName) || null);
        }
      });
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:android-app.init_form': this.onInitForm,
      'gdbots:iam:mixin:android-app.warn_form': this.onWarnForm,
      'gdbots:iam:mixin:android-app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:android-app.submit_form': this.onSubmitForm,
    };
  }
}
