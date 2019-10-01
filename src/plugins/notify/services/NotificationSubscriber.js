import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NotificationSendStatus from '@triniti/schemas/triniti/notify/enums/NotificationSendStatus';
import { formConfigs } from '../constants';

export default class NotificationSubscriber extends EventSubscriber {
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

    ['content_ref', 'body'].forEach((field) => {
      const fieldName = camelCase(field);

      if (node.has(field)) {
        data[fieldName] = node.get(field);
      }
    });

    if (node.has('app_ref')) {
      const value = node.get('app_ref');

      data.appRef = {
        label: startCase(value.getLabel().replace(/(-app|-)/g, ' ').trim()),
        value: value.toString(),
      };
    }

    const sendStatus = node.get('send_status');
    if (sendStatus === NotificationSendStatus.SCHEDULED) {
      data.sendOption = { label: 'Schedule Send', value: formConfigs.SEND_OPTIONS.SCHEDULE_SEND };
      data.sendAt = node.get('send_at');

      return;
    }

    if (node.get('send_on_publish')) {
      data.sendOption = {
        label: 'Send on publish',
        value: formConfigs.SEND_OPTIONS.SEND_ON_PUBLISH,
      };
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
    const redux = formEvent.getRedux();

    if (redux) {
      const form = redux.getState().form[formEvent.getName()];

      if (formEvent.getProps().isCreateForm) {
        ['type', 'appRef'].forEach((field) => {
          const value = get(data, `${field}.value`);

          if (!value && get(form, `fields.${field}.touched`)) {
            formEvent.addError(field, 'required field');
          }
        });

        if (!data.body && get(form, 'fields.body.touched')) {
          formEvent.addError('body', 'body is a required field for type General Message');
        }

        if (data.body) {
          try {
            node.set('body', data.body);
          } catch (e) {
            formEvent.addError('body', e.message);
          }
        }
      } else {
        const sendOption = get(data, 'sendOption.value');
        const { SCHEDULE_SEND } = formConfigs.SEND_OPTIONS;

        if (!sendOption && get(form, 'fields.sendOption.touched')) {
          formEvent.addError('sendOption', 'Please choose a send option');
        } else if (sendOption === SCHEDULE_SEND && !data.sendAt) {
          formEvent.addError('sendAt', 'Please choose a date');
        }
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

    if (formEvent.getProps().isCreateForm) {
      if (!data.contentRefs && !data.contentRefs.length && data.body) {
        node.set('title', data.body.length > 25 ? `${data.body.substr(0, 25)}...` : data.body);
      }
      node.set('content_ref', data.contentRefs[0]);
      node.set('app_ref', NodeRef.fromString(data.appRef.value));
    }

    if (node.has('body') || data.body) {
      node.set('body', data.body);
    }

    if (get(data, 'sendOption.value')) {
      // when a node is scheduled, send_on_publish must be cleared, so let's clear this anyway
      node.clear('send_on_publish');

      const { SEND_NOW, SCHEDULE_SEND, SEND_ON_PUBLISH } = formConfigs.SEND_OPTIONS;
      switch (data.sendOption.value) {
        case SCHEDULE_SEND:
          node.set('send_at', data.sendAt || null);
          break;
        case SEND_NOW:
          node.set('send_at', new Date());
          break;
        case SEND_ON_PUBLISH:
          node.set('send_on_publish', true);
          break;
        // no default
      }
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:notify:mixin:notification.init_form': this.onInitForm,
      'triniti:notify:mixin:notification.validate_form': this.onValidateForm,
      'triniti:notify:mixin:notification.submit_form': this.onSubmitForm,
    };
  }
}
