/* globals API_ENDPOINT */
import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';

export default (status) => ({
  type: actionTypes.CONNECTION_UPDATED,
  status,
});
