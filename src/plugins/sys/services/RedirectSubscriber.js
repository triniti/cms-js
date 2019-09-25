/* eslint-disable no-underscore-dangle */
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import RedirectId from '@triniti/schemas/triniti/sys/RedirectId';

export default class RedirectSubscriber extends EventSubscriber {
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

    data.title = node.get('title');
    data.redirectTo = node.get('redirect_to');
    data.isVanity = node.get('is_vanity');
    data.isPermanent = node.get('is_permanent');
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
      formEvent.addError('title', 'Request URI is required.');
    } else {
      if (!data.title.startsWith('/')) {
        formEvent.addError('title', 'Request URI must start with "/".');
      }
      if (data.title.endsWith('/')) {
        formEvent.addError('title', 'Request URI must not end with "/".');
      }

      try {
        node.set('_id', RedirectId.fromUri(data.title));
      } catch (e) {
        formEvent.addError('title', e.message);
      }
    }

    if (!data.redirectTo) {
      formEvent.addError('redirectTo', 'Redirect URI is required.');
    } else {
      try {
        node.set('redirect_to', data.redirectTo);
      } catch (e) {
        formEvent.addError('redirectTo', e.message);
      }
    }

    if ((data.title && data.redirectTo) && data.title.replace(/\//g, '').trim().toLowerCase() === data.redirectTo.replace(/\//g, '').trim().toLowerCase()) {
      formEvent.addError('title', 'Request URI and destination cannot be the same.');
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

    node.set('title', data.title);
    node.set('redirect_to', data.redirectTo);

    if (formEvent.getProps().isCreateForm) {
      node.set('_id', RedirectId.fromUri(data.title));
    } else {
      node
        .set('is_vanity', data.isVanity)
        .set('is_permanent', data.isPermanent);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:sys:mixin:redirect.init_form': this.onInitForm,
      'triniti:sys:mixin:redirect.validate_form': this.onValidateForm,
      'triniti:sys:mixin:redirect.submit_form': this.onSubmitForm,
    };
  }
}
