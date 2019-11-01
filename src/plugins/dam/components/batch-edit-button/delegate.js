import displayBatchEdit from '@triniti/cms/plugins/dam/actions/displayBatchEdit';

export default (dispatch) => ({
  handleToggleBatchEdit(display) {
    return dispatch(displayBatchEdit(display));
  },
});
