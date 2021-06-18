import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

export default class TwitterSubscriber extends EventSubscriber {
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
      'oauth_consumer_key',
      'oauth_consumer_secret',
      'oauth_token',
      'oauth_token_secret',
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
    const { oauthConsumerSecret, oauthTokenSecret } = data;

    // TODO: fix warning, it's not working here or in apple news subscriber

    if (!oauthConsumerSecret && !oauthTokenSecret) {
      return;
    }

    if (oauthConsumerSecret.length <= 50) {
      formEvent.addWarning(
        'oauthConsumerSecret',
        'Encrypted key should be longer than what currently entered. Make sure the key is encrypted',
      );
    }

    if (oauthTokenSecret.length <= 45) {
      formEvent.addWarning(
        'oauthTokenSecret',
        'Encrypted key should be longer than what currently entered. Make sure the key is encrypted',
      );
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
        'oauth_consumer_key',
        'oauth_consumer_secret',
        'oauth_token',
        'oauth_token_secret',
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
        'oauth_consumer_key',
        'oauth_consumer_secret',
        'oauth_token',
        'oauth_token_secret',
      ].forEach((fieldName) => {
        node.set(fieldName, data[camelCase(fieldName)] || null);
      });
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:twitter-app.init_form': this.onInitForm,
      'gdbots:iam:mixin:twitter-app.warn_form': this.onWarnForm,
      'gdbots:iam:mixin:twitter-app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:twitter-app.submit_form': this.onSubmitForm,
    };
  }
}
