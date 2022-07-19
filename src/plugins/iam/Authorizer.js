import Swal from 'sweetalert2';
import noop from 'lodash-es/noop';
import AuthenticationRequired from 'plugins/iam/exceptions/AuthenticationRequired';
import PermissionDenied from 'plugins/iam/exceptions/PermissionDenied';
import getPolicy from 'plugins/iam/selectors/getPolicy';
import isAuthenticated from 'plugins/iam/selectors/isAuthenticated';

const MIXINS_TO_ACTION = {
  'gdbots:ncr:mixin:create-node': 'create',
  'gdbots:ncr:mixin:delete-node': 'delete',
  'gdbots:ncr:mixin:expire-node': 'expire',
  'gdbots:ncr:mixin:get-node-request': 'get',
  'gdbots:ncr:mixin:get-node-batch-request': 'get',
  'gdbots:ncr:mixin:lock-node': 'lock',
  'gdbots:ncr:mixin:mark-node-as-draft': 'mark-as-draft',
  'gdbots:ncr:mixin:mark-node-as-pending': 'mark-as-pending',
  'gdbots:ncr:mixin:patch-node': 'patch',
  'gdbots:ncr:mixin:patch-nodes': 'patch',
  'gdbots:ncr:mixin:publish-node': 'publish',
  'gdbots:ncr:mixin:rename-node': 'rename',
  'gdbots:ncr:mixin:unlock-node': 'unlock',
  'gdbots:ncr:mixin:unpublish-node': 'unpublish',
  'gdbots:ncr:mixin:update-node': 'update',
};

export default class Authorizer {
  /**
   * @param {App} app
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * @param {PbjxEvent} pbjxEvent
   */
  checkPermission(pbjxEvent) {
    if (!pbjxEvent.isRootEvent()) {
      // lifecycle events on nested messages do not require permission
      return;
    }

    const message = pbjxEvent.getMessage();
    const schema = message.schema();
    if (!schema.hasMixin('gdbots:pbjx:mixin:request') && !schema.hasMixin('gdbots:pbjx:mixin:command')) {
      return;
    }

    const state = this.app.getRedux().getState();
    if (!isAuthenticated(state)) {
      Swal.fire({
        title: 'Session Expired',
        icon: 'error',
        html: '<p><strong>To avoid losing your work:</strong>'
          + '<ol class="text-start">'
          + '<li class="pb-2"><mark><u>DO NOT</u></mark> close or refresh.</li>'
          + '<li class="pb-2"><a href="/" target="_blank" rel="noopener noreferrer"><strong>Login</strong></a> in a new tab.</li>'
          + '<li class="pb-2">Once logged in, return to this tab.</li>'
          + '<li>Click <strong>OK</strong> and then retry your operation.</li>'
          + '</ol>'
          + '</p>',
      }).then(noop).catch(console.error);
      throw new AuthenticationRequired();
    }

    const policy = getPolicy(state);
    const permission = schema.getCurie().toString();

    if (!policy.isGranted(permission)) {
      throw new PermissionDenied(`You do not have [${permission}] permission.`);
    }

    this.checkNodeRefs(message, policy);
  }

  /**
   * @param {Message} message
   * @param {Policy} policy
   */
  checkNodeRefs(message, policy) {
    const nodeRefs = this.extractNodeRefs(message);
    if (!nodeRefs.length) {
      return;
    }

    const schema = message.schema();
    const id = schema.getId();
    let action = null;

    if (id.getVendor() === 'gdbots' && id.getPackage() === 'ncr' && id.getCategory() === 'command') {
      action = id.getMessage().replace('-node', '');
    } else if (id.getCurie().toString() === 'gdbots:ncr:request:get-node-history-request') {
      action = 'get';
    } else {
      for (const [key, value] of Object.entries(MIXINS_TO_ACTION)) {
        if (schema.hasMixin(key)) {
          action = value;
          break;
        }
      }
    }

    if (!action) {
      return;
    }

    for (const nodeRef of nodeRefs) {
      const permission = `${nodeRef.getQName()}:${action}`;
      if (!policy.isGranted(permission)) {
        throw new PermissionDenied(`You do not have [${permission}] permission.`);
      }
    }
  }

  /**
   * @param {Message} message
   *
   * @returns {NodeRef[]}
   */
  extractNodeRefs(message) {
    const refs = message.get('node_refs', []);

    if (message.has('node_ref')) {
      refs.push(message.get('node_ref'));
    }

    if (message.has('node')) {
      refs.push(message.get('node').generateNodeRef());
    }

    return refs;
  }
}
