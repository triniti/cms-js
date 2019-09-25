import swal from 'sweetalert2';
import destroyBatchOperation from '../../actions/destroyBatchOperation';
import pauseBatchOperation from '../../actions/pauseBatchOperation';
import resumeBatchOperation from '../../actions/resumeBatchOperation';
import { batchOperationStatuses } from '../../constants';

export default (dispatch, { nodeLabel = 'nodes', onCloseModal = () => {} }) => ({

  /**
   * Destroy the batch process object on the store if batch operation is finished.
   * @param {Object} batchOperation state
   */
  handleDestroyBatchOperation: async ({ status, progress }) => {
    if (status === batchOperationStatuses.ENDED) {
      dispatch(pauseBatchOperation());
      dispatch(destroyBatchOperation());
      onCloseModal();
      return;
    }
    // if process is not finished yet, ask user for confirmation to continue
    const isPaused = (status === batchOperationStatuses.PAUSED);
    dispatch(pauseBatchOperation());
    const result = await swal.fire({
      title: 'Are you sure?',
      text: `Incomplete process! Only ${progress}% of selected ${nodeLabel} are done.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmed!',
      cancelButtonText: !isPaused ? 'Continue' : 'Cancel',
      reverseButtons: true,
    });
    if (result.value) {
      dispatch(destroyBatchOperation());
      onCloseModal();
    } else if (!isPaused) {
      dispatch(resumeBatchOperation());
    }
  },

  /**
   * Pause the pending batch operation.
   */
  handlePauseBatchOperation: () => dispatch(pauseBatchOperation()),

  /**
   * Resume the cancelled batch operation.
   */
  handleResumeBatchOperation: () => dispatch(resumeBatchOperation()),

});
