import get from 'lodash/get';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class IosNotificationSubscriber extends EventSubscriber {
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

    if (node.get('fcm_topics')) {
      const value = node.get('fcm_topics');
      data.fcmTopics = value.map((topic) => ({ label: topic, value: topic }));
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

    if (data.fcmTopics) {
      try {
        node.addToSet('fcm_topics', data.fcmTopics.map((topic) => topic.value));
      } catch (e) {
        formEvent.addError('fcm_topics', e.message);
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

    if (node.has('fcm_topics') || get(data, 'fcmTopics')) {
      node.clear('fcm_topics');
      node.addToSet('fcm_topics', data.fcmTopics.map((topic) => topic.value));
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:notify:mixin:ios-notification.init_form': this.onInitForm,
      'triniti:notify:mixin:ios-notification.validate_form': this.onValidateForm,
      'triniti:notify:mixin:ios-notification.submit_form': this.onSubmitForm,
    };
  }
}
