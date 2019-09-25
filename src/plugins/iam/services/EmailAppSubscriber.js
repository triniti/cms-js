import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import isValidEmail from '@gdbots/common/isValidEmail';
import getKeyValuesFieldErrors
  from '@triniti/cms/components/key-values-field/getKeyValuesFieldErrors';
import isEmpty from 'lodash/isEmpty';

export default class EmailAppSubscriber extends EventSubscriber {
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

    if (node.has('sendgrid_api_key')) {
      data.sendgridApiKey = node.get('sendgrid_api_key');
    }
    data.sendgridSuppressionGroupId = node.get('sendgrid_suppression_group_id');

    ['sendgrid_lists', 'sendgrid_senders'].forEach((field) => {
      const fieldName = camelCase(field);

      if (node.has(field)) {
        data[fieldName] = Object.entries(node.get(field)).map(
          (val) => ({ key: val[0], value: val[1] }),
        );
      }
    });
  }

  /**
   * Occurs before validation and is used to add warnings.
   *
   * @param {FormEvent} formEvent
   */
  onWarnForm(formEvent) {
    const { sendgridApiKey } = formEvent.getData();

    if (!sendgridApiKey) {
      return;
    }

    if (sendgridApiKey.length < 300) {
      formEvent.addWarning(
        'sendgridApiKey',
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
      ['sendgrid_api_key', 'sendgrid_suppression_group_id'].forEach((field) => {
        const fieldName = camelCase(field);
        const value = get(data, `${fieldName}.value`);

        if (value) {
          try {
            node.set(field, value);
          } catch (e) {
            formEvent.addError(fieldName, e.message);
          }
        }
      });

      ['sendgrid_lists', 'sendgrid_senders'].forEach((field) => {
        const fieldName = camelCase(field);
        const value = data[fieldName];

        if (!isEmpty(value)) {
          const { errors, hasError } = getKeyValuesFieldErrors(data, fieldName, node);

          if (hasError) {
            formEvent.addError(fieldName, errors);
          }

          // special check for `sendgrid_senders`: validate if the key is an email address
          if (field === 'sendgrid_senders') {
            const keyErrors = value.map(({ key }) => {
              const error = {};
              if (!isValidEmail(key)) {
                error.value = 'Enter a valid email address';
              }

              return !isEmpty(error) ? error : null;
            });

            if (keyErrors.find((error) => error)) {
              formEvent.addError(fieldName, keyErrors);
            }
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
      node.set('sendgrid_api_key', data.sendgridApiKey || null);
      node.set('sendgrid_suppression_group_id', Number(data.sendgridSuppressionGroupId) || null);

      ['sendgrid_lists', 'sendgrid_senders'].forEach((field) => {
        const fieldValue = get(data, camelCase(field));

        if (node.has(field) || !isEmpty(fieldValue) || fieldValue > 0) {
          node.clear(field);

          if (typeof fieldValue === 'object') {
            fieldValue.forEach(
              ({ key, value }) => node.addToMap(field, key, Number(value)),
            );
          } else {
            node.set(field, fieldValue);
          }
        }
      });
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:email-app.init_form': this.onInitForm,
      'gdbots:iam:mixin:email-app.warn_form': this.onWarnForm,
      'gdbots:iam:mixin:email-app.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:email-app.submit_form': this.onSubmitForm,
    };
  }
}
