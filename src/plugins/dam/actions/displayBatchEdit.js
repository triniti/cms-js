import { actionTypes } from '@triniti/cms/plugins/dam/constants';

export default (display) => ({
  type: actionTypes.DISPLAY_BATCH_EDIT_REQUESTED,
  display,
});
