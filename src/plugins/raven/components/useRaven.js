import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getInstance } from '@triniti/app/main.js';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration.js';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration.js';

export default (nodeRef, canCollaborate, viewModeUrl) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!canCollaborate) {
      return;
    }

    dispatch(joinCollaboration(nodeRef));

    const listener = async (event) => {
      if (!isMounted.current) {
        return;
      }

      console.log('useRaven', event.toObject());
    };

    const app = getInstance();
    app.getDispatcher().addListener('gdbots:pbjx:mixin:event', listener);

    return () => {
      dispatch(leaveCollaboration(nodeRef));
      app.getDispatcher().removeListener('gdbots:pbjx:mixin:event', listener);
    };
  }, [nodeRef, canCollaborate]);
};
