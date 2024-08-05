import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getInstance } from '@triniti/app/main.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import toast from '@triniti/cms/utils/toast.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';
import heartbeat from '@triniti/cms/plugins/raven/actions/heartbeat.js';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration.js';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration.js';
import subscribe from '@triniti/cms/plugins/raven/actions/subscribe.js';
import unsubscribe from '@triniti/cms/plugins/raven/actions/unsubscribe.js';
import shouldShowStaleDataWarning from '@triniti/cms/plugins/raven/utils/shouldShowStaleDataWarning.js';
import showStaleDataWarning from '@triniti/cms/plugins/raven/utils/showStaleDataWarning.js';

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
      const node = app.select(getNode, nodeRef);
      if (!shouldShowStaleDataWarning(pbj.generateMessageRef(), null, node)) {
        return;
      }

      const ref = NodeRef.fromString(`${nodeRef}`);
      const userRef = pbj.has('ctx_user_ref') ? NodeRef.fromMessageRef(pbj.get('ctx_user_ref')) : '';
      let username = 'SYSTEM';
      if (userRef) {
        const user = app.select(getNode, userRef);
        if (user) {
          username = user.get('title');
        }
      }

      await showStaleDataWarning(ref, username);
    };

    app.getDispatcher().addListener(`raven.${nodeRef}`, listener);

    return () => {
      dispatch(unsubscribe(nodeRef));
      app.getDispatcher().removeListener(`raven.${nodeRef}`, listener);
    };
  }, [nodeRef]);

  useEffect(() => {
    let heartbeatInterval = null;
    const startCollaboration = () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }

      dispatch(joinCollaboration(nodeRef));
      heartbeatInterval = setInterval(() => {
        dispatch(heartbeat(nodeRef));
      }, 10000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        startCollaboration();
      } else {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
      }
    };

    if (editMode && canCollaborate) {
      startCollaboration();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      dispatch(leaveCollaboration(nodeRef));
    };
  }, [nodeRef, editMode, canCollaborate]);
};
