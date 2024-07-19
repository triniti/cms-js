import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';

export default (exception) => ({
  type: actionTypes.CONNECTION_REJECTED,
  exception,
});
