import EventSubscriber from '@gdbots/pbjx/EventSubscriber';

export default class UserSubscriber extends EventSubscriber {
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
    const user = formEvent.getMessage();

    data.email = user.get('email');
    data.firstName = user.get('first_name');
    data.lastName = user.get('last_name');
    data.isStaff = user.get('is_staff');
    data.isBlocked = user.get('is_blocked');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const user = formEvent.getMessage();

    if (!data.email) {
      formEvent.addError('email', 'Email is required');
    }

    if (data.email) {
      try {
        user.set('email', data.email);
      } catch (e) {
        formEvent.addError('email', e.message);
      }
    }

    if (!data.firstName) {
      formEvent.addError('firstName', 'First Name is required');
    }

    if (data.firstName) {
      try {
        user.set('first_name', data.firstName);
      } catch (e) {
        formEvent.addError('firstName', e.message);
      }
    }

    if (!data.lastName) {
      formEvent.addError('lastName', 'Last Name is required');
    }

    if (data.lastName) {
      try {
        user.set('last_name', data.lastName);
      } catch (e) {
        formEvent.addError('lastName', e.message);
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

    node.set('email', data.email)
      .set('first_name', data.firstName)
      .set('last_name', data.lastName)
      .set('is_staff', data.isStaff)
      .set('is_blocked', data.isBlocked);

    if (!formEvent.getProps().isCreateForm) {
      node.set('title', `${data.firstName} ${data.lastName}`);
    }
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:user.init_form': this.onInitForm,
      'gdbots:iam:mixin:user.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:user.submit_form': this.onSubmitForm,
    };
  }
}
