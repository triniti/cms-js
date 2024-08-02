import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getInstance } from '@triniti/app/main.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import toast from '@triniti/cms/utils/toast.js';
import joinCollaboration from '@triniti/cms/plugins/raven/actions/joinCollaboration.js';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration.js';
import subscribe from '@triniti/cms/plugins/raven/actions/subscribe.js';
import unsubscribe from '@triniti/cms/plugins/raven/actions/unsubscribe.js';

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

      const pbj = event.getMessage();
      console.log('useRaven.editMode', event.isMine(), pbj.toObject());
    };

    const app = getInstance();
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
