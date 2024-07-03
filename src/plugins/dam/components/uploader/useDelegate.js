import { useEffect } from 'react';
import startCase from 'lodash-es/startCase.js';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import updateNode from '@triniti/cms/plugins/ncr/actions/updateNode.js';

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
        const message = getFriendlyErrorMessage(e);
        dispatch(sendAlert({ type: 'danger', message }));
        return { [FORM_ERROR]: message };
      }
    };

    await form.submit();
  };

  delegate.patchAssets = async (field) => {
    /// yaaass
  };

  return delegate;
};
