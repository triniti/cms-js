import { useEffect } from 'react';
import startCase from 'lodash-es/startCase.js';
import { useDispatch } from 'react-redux';
//import { useBlocker } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import Swal from 'sweetalert2';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import clearAlerts from '@triniti/cms/actions/clearAlerts.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import deleteNode from '@triniti/cms/plugins/ncr/actions/deleteNode.js';
import duplicateNode from '@triniti/cms/plugins/ncr/actions/duplicateNode.js';
import lockNode from '@triniti/cms/plugins/ncr/actions/lockNode.js';
import unlockNode from '@triniti/cms/plugins/ncr/actions/unlockNode.js';
import updateNode from '@triniti/cms/plugins/ncr/actions/updateNode.js';
import publishNode from '@triniti/cms/plugins/ncr/actions/publishNode.js';
import useBlocker from '@triniti/cms/plugins/ncr/components/with-node-screen/useBlocker.js';
import useRaven from '@triniti/cms/plugins/raven/components/useRaven.js';

const okayToDelete = async (nodeRef) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Delete ${startCase(nodeRef.getLabel())}`,
    reverseButtons: true,
  });

  return !!result.value;
};

const okayToLeave = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You have unsaved changes!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, leave!',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.value;
};

const okayToLock = async (nodeRef) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Node will be locked from other users.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Lock ${startCase(nodeRef.getLabel())}`,
    reverseButtons: true,
  });

  return !!result.value;
};

const okayToUnlock = async (nodeRef) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Node will be unlocked from other users.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Unlock ${startCase(nodeRef.getLabel())}`,
    reverseButtons: true,
  });

  return !!result.value;
};

// fixme: ncr policy checks and flags
export default (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    delegate,
    form,
    formState,
    editMode,
    refreshNode,
    nodeRef,
    node,
    qname,
    policy,
    urls
  } = props;

  useRaven(nodeRef, editMode, policy.isGranted(`${qname}:update`));

  useBlocker(async (transition) => {
    const nextUri = transition.pathname;
    if (nextUri.startsWith(urls.baseUri)) {
      return false;
    }

    return !(await okayToLeave());
  }, editMode && formState.dirty);

  useEffect(() => {
    if (!editMode || !formState.dirty) {
      return;
    }

    const confirmUnloadIfDirty = (event) => {
      event.preventDefault();
      const start = setTimeout(() => {
        const cancel = setTimeout(() => {
          clearTimeout(cancel);
          // user canceled leaving/closing the page
        });
        clearTimeout(start);
      });
      event.returnValue = 'Unsaved changes detected.'; // required to work in Chrome
    };

    window.addEventListener('beforeunload', confirmUnloadIfDirty);
    return () => {
      window.removeEventListener('beforeunload', confirmUnloadIfDirty);
    };
  }, [editMode, formState.dirty]);

  delegate.handleCancel = async () => {
    await navigate(urls.leave);
  };

  delegate.handleClose = delegate.handleCancel;

  delegate.handleDelete = async () => {
    const ref = NodeRef.fromString(nodeRef);
    if (!await okayToDelete(ref)) {
      return;
    }

    try {
      await progressIndicator.show(`Deleting ${startCase(ref.getLabel())}...`);
      await dispatch(deleteNode(nodeRef));
      await progressIndicator.close();
      toast({ title: `${startCase(ref.getLabel())} deleted.` });
      dispatch(clearAlerts());
      await navigate(urls.leave);
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  delegate.handleDuplicate = async () => {
    const ref = NodeRef.fromString(nodeRef);
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Duplicate ${startCase(ref.getLabel())}`,
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.value) {
      return;
    }

    try {
      await progressIndicator.show(`Duplicating ${startCase(ref.getLabel())}...`);
      const newNode = await dispatch(duplicateNode(node));
      await progressIndicator.close();
      toast({ title: `${startCase(ref.getLabel())} duplicated.` });
      dispatch(clearAlerts());
      await navigate(nodeUrl(newNode, 'edit'));
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  delegate.handleLock = async () => {
    const ref = NodeRef.fromString(nodeRef);
    if (!await okayToLock(ref)) {
      return;
    }

    try {
      await progressIndicator.show(`Locking ${startCase(ref.getLabel())}...`);
      await dispatch(lockNode(nodeRef));
      await progressIndicator.close();
      toast({ title: `${startCase(ref.getLabel())} Locked.` });
      dispatch(clearAlerts());
      await refreshNode();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  delegate.handleSave = async (event) => {
    const action = event.target?.value || 'save';
    delegate.handleSubmit = async (values) => {
      try {
        const ref = NodeRef.fromString(nodeRef);
        await progressIndicator.show(`Saving ${startCase(ref.getLabel())}...`);
        await dispatch(updateNode(values, form, node));

        if (action === 'save-and-close') {
          delegate.shouldReinitialize = true;
          delegate.onAfterReinitialize = () => {
            progressIndicator.close();
            toast({ title: `${startCase(ref.getLabel())} saved.` });
            dispatch(clearAlerts());
            setTimeout(() => {
              navigate(urls.leave);
            });
          };
          setTimeout(refreshNode);
          return;
        }

        if (action === 'save-and-publish' && node.schema().hasMixin('gdbots:ncr:mixin:publishable')) {
          await progressIndicator.update(`Publishing ${startCase(ref.getLabel())}...`);
          await dispatch(publishNode(nodeRef));
        }

        delegate.shouldReinitialize = true;
        delegate.onAfterReinitialize = () => {
          progressIndicator.close();
          toast({ title: `${startCase(ref.getLabel())} saved.` });
        };
        setTimeout(refreshNode);
      } catch (e) {
        await progressIndicator.close();
        const message = getFriendlyErrorMessage(e);
        dispatch(sendAlert({ type: 'danger', message }));
        return { [FORM_ERROR]: message };
      }
    };

    await form.submit();
  };

  delegate.handleSwitchMode = async () => {
    if (editMode && formState.dirty && !await okayToLeave()) {
      return;
    }

    delegate.shouldReinitialize = true;
    await navigate(editMode ? urls.viewMode : urls.editMode);
    await refreshNode();
  };

  delegate.handleStatusUpdated = async (action, publishAt) => {
    await refreshNode();
  };

  delegate.handleUnlock = async () => {
    const ref = NodeRef.fromString(nodeRef);
    if (!await okayToUnlock(ref)) {
      return;
    }

    console.log('here', urls)

    try {
      await progressIndicator.show(`Unlocking ${startCase(ref.getLabel())}...`);
      await dispatch(unlockNode(nodeRef));
      await progressIndicator.close();
      toast({ title: `${startCase(ref.getLabel())} Unlocked.` });
      dispatch(clearAlerts());
      await refreshNode();
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  delegate.refreshNode = refreshNode;

  return delegate;
};
