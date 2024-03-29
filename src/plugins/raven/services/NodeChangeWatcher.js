/* globals APP_NAME */
import swal from 'sweetalert2';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import getNode from 'plugins/ncr/selectors/getNode';
import hasNode from 'plugins/ncr/selectors/hasNode';
import getUser from 'plugins/iam/selectors/getUser';
import isCollaborating from 'plugins/raven/selectors/isCollaborating';

export default class NodeChangeWatcher {
  constructor(app) {
    this.app = app;
  }

  /**
   * @param {FilterActionEvent} event
   */
  forceRefresh(event) {
    const pbj = event.getMessage();
    const schema = pbj.schema();

    if (!schema.hasMixin('gdbots:pbjx:mixin:event')) {
      return;
    }

    /**
     * - gdbots:ncr:event:node-labels-updated is safely merged server side
     * - ovp.medialive events use a node_ref but are not really node operations, so the warning is unnecessary
     */
    if (schema.getCurie().toString() === 'gdbots:ncr:event:node-labels-updated'
      || schema.getCurie().getPackage() === 'ovp.medialive'
    ) {
      return;
    }

    if (!pbj.has('node_ref')) {
      return;
    }

    const state = this.app.getRedux().getState();
    const nodeRef = pbj.get('node_ref');

    let username = 'SYSTEM';
    if (pbj.has('ctx_user_ref')) {
      const userRef = NodeRef.fromMessageRef(pbj.get('ctx_user_ref'));
      const currentUserRef = NodeRef.fromNode(getUser(state));
      const isMyEvent = currentUserRef.equals(userRef);
      if (pbj.has('ctx_app') && pbj.get('ctx_app').get('name') === APP_NAME && isMyEvent) {
        return;
      }

      if (hasNode(state, userRef)) {
        const user = getNode(state, userRef);
        username = user.get('title', `${user.get('first_name')} ${user.get('last_name')}`);
      }
    }

    /*
     * these are being auto-updated on the redux form in ArticleSubscriber
     * we still want to warn the user who's sitting on this screen in view mode though.
     */
    if (isCollaborating(state, nodeRef) && (
      schema.hasMixin('triniti:news:mixin:apple-news-article-synced')
      || schema.hasMixin('triniti:news:mixin:article-slotting-removed')
      || schema.hasMixin('triniti:curator:mixin:teaser-slotting-removed')
    )) {
      return;
    }

    if (isCollaborating(state, nodeRef)) {
      swal.fire({
        html: `This ${nodeRef.getLabel()} has been changed by <strong>${username}</strong>.<br/>If you save, you may overwrite their changes.`,
        position: 'top-end',
        showCloseButton: true,
        showConfirmButton: false,
        titleText: 'STALE DATA',
        toast: true,
        icon: 'warning',
      });
    } else {
      swal.fire({
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: `Refresh ${nodeRef.getLabel()}`,
        html: `This ${nodeRef.getLabel()} has been changed by <strong>${username}</strong> <em>(${schema.getCurie()})</em>.`,
        showCancelButton: true,
        cancelButtonText: 'Ignore',
        reverseButtons: true,
        title: 'STALE DATA',
        icon: 'warning',
      }).then((result) => {
        if (result.value) {
          window.location.reload(); // eslint-disable-line
        }
      });
    }
  }
}
