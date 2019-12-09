/* globals APP_NAME */
import swal from 'sweetalert2';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import { actionTypes } from '@gdbots/pbjx/constants';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isCollaborating from '../selectors/isCollaborating';

export default class NodeChangeWatcher extends EventSubscriber {
  constructor() {
    super();
    this.forceRefresh = this.forceRefresh.bind(this);
  }

  /**
   * @param {FilterActionEvent} event
   */
  forceRefresh(event) {
    const { pbj } = event.getAction();
    const schema = pbj.schema();

    if (!schema.hasMixin('gdbots:pbjx:mixin:event')) {
      return;
    }

    if (!pbj.has('node_ref')) {
      return;
    }

    const state = event.getRedux().getState();
    const nodeRef = pbj.get('node_ref');
    if (window.location.pathname.indexOf(nodeRef.getId()) === -1) {
      return;
    }

    let username = 'SYSTEM';
    if (pbj.has('ctx_user_ref')) {
      const userRef = NodeRef.fromMessageRef(pbj.get('ctx_user_ref'));
      const isMyEvent = getAuthenticatedUserRef(state).equals(userRef);
      if (pbj.has('ctx_app') && pbj.get('ctx_app').get('name') === APP_NAME && isMyEvent) {
        return;
      }

      if (hasNode(state, userRef)) {
        const user = getNode(state, userRef);
        username = user.get('title', user.get('first_name'));
      }
    }

    /*
     * these are being auto-updated on the redux form in ArticleSubscriber
     * we still want to warn the user who's sitting on this screen in view mode though.
     */
    if (isCollaborating(state, nodeRef) && (
      schema.hasMixin('triniti:news:mixin:apple-news-article-synced')
      || schema.hasMixin('triniti:news:mixin:article-slotting-removed')
    )) {
      return;
    }

    /**
     * medialive events use a node_ref but are not really node operations, so the warning is
     * unnecessary
     */
    if (schema.getCurie().getPackage() === 'ovp.medialive') {
      return;
    }

    swal.fire({
      type: 'warning',
      title: 'STALE DATA',
      html: `This ${nodeRef.getLabel()} has been changed by <strong>${username}</strong> <em>(${schema.getCurie()})</em>.`,
      allowEscapeKey: false,
      allowEnterKey: false,
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonText: `Refresh ${nodeRef.getLabel()}`,
      cancelButtonText: isCollaborating(state, nodeRef)
        ? 'Ignore - you will not be able to save'
        : 'Ignore',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        window.location.reload(); // eslint-disable-line
      }
    });
  }

  getSubscribedEvents() {
    return {
      [actionTypes.FULFILLED]: this.forceRefresh,
    };
  }
}
