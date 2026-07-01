import { useEffect } from 'react';
import startCase from 'lodash-es/startCase.js';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import updateNode from '@triniti/cms/plugins/ncr/actions/updateNode.js';
import patchAssets from '@triniti/cms/plugins/dam/actions/patchAssets.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

export default (props) => {
  const {
    batch,
    delegate,
    form,
    formState,
    pbj,
    refreshNode,
    nodeRef,
    controls
  } = props;

  const dispatch = useDispatch();
  controls.current.form = form;
  controls.current.delegate = delegate;
  controls.current.formState = formState;

  useEffect(() => {
    delegate.shouldReinitialize = true;
  }, [pbj]);

  delegate.handleSave = async () => {
    delegate.handleSubmit = async (values) => {
      try {
        await progressIndicator.show(`Saving ${startCase(nodeRef.getLabel())}...`);
        await dispatch(updateNode(values, form, pbj));

        delegate.shouldReinitialize = true;
        delegate.onAfterReinitialize = () => {
          progressIndicator.close();
          toast({ title: `${startCase(nodeRef.getLabel())} saved.` });
        };
        setTimeout(() => {
          refreshNode();
          batch.refresh();
        });
      } catch (e) {
        await progressIndicator.close();
        return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
      }
    };

    await form.submit();
  };

  delegate.handleApplyToAll = async (field) => {
    if (batch.completed <= 1) {
      return;
    }

    const value = formState.values[field];
    if (!value) {
      return;
    }

    const refs = [];
    for (const upload of batch.values()) {
      if (upload.status === uploadStatus.COMPLETED) {
        const asset = await upload.result;
        refs.push(asset.generateNodeRef());
      }
    }

    try {
      await progressIndicator.show(`Applying [${field}] to ${refs.length} assets...`);
      await dispatch(patchAssets(refs, { [field]: value }));
      form.setConfig('keepDirtyOnReinitialize', true);
      delegate.shouldReinitialize = true;
      delegate.onAfterReinitialize = () => {
        // reinitialize runs restart(), which clears touched on every field. Re-mark the
        // fields that still hold unsaved edits so they keep their green (edited) indicator;
        // the applied field now matches the server (pristine) and is left unmarked.
        const { dirtyFields } = form.getState();
        Object.keys(dirtyFields).forEach((name) => form.blur(name));
        progressIndicator.close();
        toast({ title: `Applied [${field}] to ${refs.length} assets.` });
      };
      setTimeout(refreshNode);
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  return delegate;
};
