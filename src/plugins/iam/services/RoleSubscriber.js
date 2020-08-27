/* eslint-disable no-underscore-dangle */
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import RoleId from '@gdbots/schemas/gdbots/iam/RoleId';

import getAuthenticatedUserRef from '../selectors/getAuthenticatedUserRef';
import authRoles from '../utils/authRoles';
import updatePolicy from '../actions/updatePolicy';
import Policy from '../Policy';
import getAccessToken from '../selectors/getAccessToken';

export default class RoleSubscriber extends EventSubscriber {
  constructor(authenticator, container) {
    super();
    this.onInitForm = this.onInitForm.bind(this);
    this.onValidateForm = this.onValidateForm.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onUserRolesUpdated = this.onUserRolesUpdated.bind(this);
    this.authenticator = authenticator;
    this.vendorName = container.get('app_vendor');
  }

  /**
   * Runs when the form is first created and is used to
   * update initial values.
   *
   * @param {FormEvent} formEvent
   */
  onInitForm(formEvent) {
    const data = formEvent.getData();
    const role = formEvent.getMessage();

    data._id = role.get('_id') ? role.get('_id').toString() : null;
    data.allowed = role.get('allowed');
    data.denied = role.get('denied');
  }

  /**
   * This is the redux form sync validation process.
   *
   * @param {FormEvent} formEvent
   */
  onValidateForm(formEvent) {
    const data = formEvent.getData();
    const role = formEvent.getMessage();

    if (!data._id) {
      formEvent.addError('_id', 'Role name is required');
    } else {
      try {
        role.set('_id', RoleId.fromString(data._id));
      } catch (e) {
        formEvent.addError('_id', `"${data._id}" is not a valid role name.`);
      }
    }

    if (data.allowed) {
      const allowedArrayErrors = [];
      data.allowed.forEach((permission, index) => {
        if (!permission) {
          allowedArrayErrors[index] = 'Please remove empty allowed permissions';
        }

        try {
          role.addToSet('allowed', [permission]);
        } catch (e) {
          allowedArrayErrors[index] = e.message;
        }
      });

      if (allowedArrayErrors.length > 0) {
        formEvent.addError('allowed', allowedArrayErrors);
      }
    }

    if (data.denied) {
      const deniedArrayErrors = [];
      data.denied.forEach((permission, index) => {
        if (!permission) {
          deniedArrayErrors[index] = 'Please remove empty denied permissions';
        }

        try {
          role.addToSet('denied', [permission]);
        } catch (e) {
          deniedArrayErrors[index] = e.message;
        }
      });

      if (deniedArrayErrors.length > 0) {
        formEvent.addError('denied', deniedArrayErrors);
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

    node.set('_id', RoleId.create(data._id))
      .clear('allowed')
      .clear('denied')
      .addToSet('allowed', (data.allowed || []))
      .addToSet('denied', (data.denied || []));
  }

  /**
   * Function will be called when a user successfully updated his/her roles or another user's roles.
   * If a user updated his/her own roles or other user's roles, the policy stored on Redux for the
   * targeted user will also get updated inorder for the new policy modification to be right away
   * effective.
   *
   * @param event
   */
  onUserRolesUpdated(event) {
    const state = event.getRedux().getState();
    if (getAuthenticatedUserRef(state).getId()
      !== event.getAction().pbj.get('node_ref').getId()) {
      return;
    }
    this.authenticator.getUser(getAccessToken(state))
      .then(() => event.getRedux().dispatch(updatePolicy(new Policy(authRoles.get()))));
  }

  getSubscribedEvents() {
    return {
      'gdbots:iam:mixin:role.init_form': this.onInitForm,
      'gdbots:iam:mixin:role.validate_form': this.onValidateForm,
      'gdbots:iam:mixin:role.submit_form': this.onSubmitForm,
      [`${this.vendorName}:iam:event:user-roles-granted`]: this.onUserRolesUpdated,
      [`${this.vendorName}:iam:event:user-roles-revoked`]: this.onUserRolesUpdated,
    };
  }
}
