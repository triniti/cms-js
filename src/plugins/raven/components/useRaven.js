import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { getInstance } from '@triniti/app/main.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import toast from '@triniti/cms/utils/toast.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration.js';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration.js';
import subscribe from '@triniti/cms/plugins/raven/actions/subscribe.js';
import unsubscribe from '@triniti/cms/plugins/raven/actions/unsubscribe.js';

const showStaleDataAlert = async (nodeRef, username) => {
  const result = await Swal.fire({
    title: 'STALE DATA',
    html: `<strong>${username}</strong> updated this ${nodeRef.getLabel()}.<br/>If you save, you may overwrite their changes.`,
    position: 'top-end',
    grow: 'row',
    icon: 'warning',
    toast: true,
    showCloseButton: true,
    showConfirmButton: false,
  });

  return !!result.value;
};

export default (nodeRef, editMode, canCollaborate) => {
  const formContext = useFormContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(false);
  const editModeRef = useRef(editMode);
  editModeRef.current = editMode;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(subscribe(nodeRef));
    const app = getInstance();

    const listener = async (event) => {
      if (!isMounted.current) {
        return;
      }

      if (!editModeRef.current) {
        toast({ title: 'Updated to latest version.' });
        formContext.delegate.shouldReinitialize = true;
        formContext.delegate.refreshNode();
        return;
      }

      if (event.isMine()) {
        // we ignore our own events
        return;
      }

      const pbj = event.getMessage();
      const ref = NodeRef.fromString(`${nodeRef}`);
      const userRef = pbj.has('ctx_user_ref') ? NodeRef.fromMessageRef(pbj.get('ctx_user_ref')) : '';
      let username = 'SYSTEM';
      if (userRef) {
        const user = app.select(getNode, userRef);
        if (user) {
          username = user.get('title');
        }
      }

      await showStaleDataAlert(ref, username);
    };

    app.getDispatcher().addListener(`raven.${nodeRef}`, listener);

    return () => {
      dispatch(unsubscribe(nodeRef));
      app.getDispatcher().removeListener(`raven.${nodeRef}`, listener);
    };
  }, [nodeRef]);

  useEffect(() => {
    if (editMode && canCollaborate) {
      dispatch(joinCollaboration(nodeRef));
    }

    return () => {
      dispatch(leaveCollaboration(nodeRef));
    };
  }, [nodeRef, editMode, canCollaborate]);
};
