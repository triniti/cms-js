import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import camelCase from 'lodash/camelCase';
import getTextAreaFieldError from '@triniti/cms/components/textarea-field/getTextAreaFieldError';
import getTextFieldError from '@triniti/cms/components/text-field/getTextFieldError';
import get from 'lodash/get';

export default class TwitterAppSubscriber extends EventSubscriber {
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

    if (!oauthConsumerSecret && !oauthTokenSecret) {
      return;
    }

    if (oauthConsumerSecret && oauthConsumerSecret.length <= 50) {
      formEvent.addWarning(
        'oauthConsumerSecret',
        'Oauth consumer secret should be longer than what currently entered. Make sure the oauth consumer secret is encrypted',
      );
    }

    if (oauthTokenSecret && oauthTokenSecret.length <= 45) {
      formEvent.addWarning(
        'oauthTokenSecret',
        'Oauth token secret should be longer than what currently entered. Make sure the oauth token secret is encrypted',
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
      let error;
      // Fields using TextField component
      ['oauth_consumer_key', 'oauth_token'].forEach((fieldName) => {
        error = getTextFieldError(data, camelCase(fieldName), node);
        if (error) {
          formEvent.addError(camelCase(fieldName), error);
        }
      });

      ['oauth_consumer_secret', 'oauth_token_secret'].forEach((fieldName) => {
        error = getTextAreaFieldError(data, camelCase(fieldName), node);
        if (error) {
          formEvent.addError(camelCase(fieldName), error);
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
      ].forEach((field) => {
        const fieldName = camelCase(field);

        if (get(data, fieldName) || node.has(field)) {
          node.set(field, get(data, fieldName) || null);
        }
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
