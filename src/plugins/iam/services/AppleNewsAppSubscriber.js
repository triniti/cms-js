import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

export default class AppleNewsAppSubscriber extends EventSubscriber {
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
   *
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const node = formEvent.getMessage();

    [
      'api_key',
      'api_secret',
      'channel_id',
    ].forEach((schemaFieldName) => {
      const formFieldName = camelCase(schemaFieldName);
      data[formFieldName] = node.get(schemaFieldName);
    });
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const data = formEvent.getData();
    const { apiSecret } = data;

    if (!apiSecret) {
      return;
    }

    const apiSecretWarning = apiSecret.length <= 200
      ? 'An encrypted apple news api secret is usually longer than the current input,'
      + ' please make sure you have the correct encrypted value entered!'
      + ' NOTE: YOU SHOULD NEVER ENTER THE UNENCRYPTED VALUE HERE!'
      : '';

    if (apiSecret && !!apiSecretWarning) {
      formEvent.addWarning('apiSecret', apiSecretWarning);
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
      [
        'api_key',
        'api_secret',
        'channel_id',
      ].forEach((schemaFieldName) => {
        const formFieldName = camelCase(schemaFieldName);
        if (!data[formFieldName]) {
          formEvent.addError(formFieldName, `${startCase(schemaFieldName)} is required`);
        } else {
          try {
            node.set(schemaFieldName, data[formFieldName]);
          } catch (e) {
            formEvent.addError(formFieldName, e.message);
          }
        }
      });
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
      [
        'api_key',
        'api_secret',
        'channel_id',
      ].forEach((fieldName) => {
        node.set(fieldName, data[camelCase(fieldName)] || null);
      });
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:apple-news-app.init_form': this.onInitForm,
      'gdbots:iam:mixin:apple-news-app.warn_form': this.onWarnForm,
      'gdbots:iam:mixin:apple-news-app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:apple-news-app.submit_form': this.onSubmitForm,
    };
  }
}
