import { ContentState, EditorState } from 'draft-js';
import { select } from 'redux-saga/effects';
import { getFormValues } from 'redux-form';
import { convertToCanvasBlocks } from '@triniti/cms/plugins/blocksmith/utils';
import getAlerts from '@triniti/admin-ui-plugin/selectors/getAlerts';
import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';
import swal from 'sweetalert2';

export default function* stopSubmitFlow(action) {
  console.log(action);
  const { meta, payload } = action;
  if (!payload) {
    return; // action is not the result of an error
  }
  const alerts = yield select(getAlerts);
  const hasAlert = !!alerts.find((alert) => alert.message.includes(payload._error));
  if (hasAlert) {
    return; // being handled elsewhere
  }
  const blocksmith = yield select(getBlocksmith, meta.form);
  const formValues = yield select(getFormValues(meta.form));
  const nodeRef = formValues._id.toNodeRef();
  const canvasBlocks = [];
  // todo: check if there already is an alert visible
  blocksmith.editorState.getCurrentContent().getBlockMap().forEach((block) => {
    const singleBlockEditorState = EditorState.push(
      EditorState.createEmpty(),
      ContentState.createFromBlockArray([block]),
    );
    try {
      const [canvasBlock] = convertToCanvasBlocks(singleBlockEditorState);
      canvasBlocks.push({
        canvasBlock,
        valid: true,
      });
    } catch (e) {
      canvasBlocks.push({
        block,
        e: {
          message: e.message,
          name: e.name,
          stack: e.stack,
        },
        valid: false,
      });
    }
  });
  sessionStorage.setItem(nodeRef.toString(), JSON.stringify({
    action,
    blocksmith,
    canvasBlocks,
    formValues,
  }));
  window.wtfCanvasBlocks = canvasBlocks;
  window.wtfFormValues = formValues;
  window.wtfAction = action;
  window.wtfBlocksmith = blocksmith;
  console.log('here', formValues);
  yield swal.fire({
    allowOutsideClick: false,
    confirmButtonClass: 'btn btn-danger',
    confirmButtonText: 'I understand.',
    title: 'A form error occurred and this content cannot be saved. Please keep this browser tab open and contact support.',
    type: 'error',
  });
}
