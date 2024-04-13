/* globals API_ENDPOINT */
import { actionTypes } from '@triniti/cms/plugins/raven/constants';

export default (collaborations) => ({
  type: actionTypes.COLLABORATIONS_UPDATED,
  collaborations,
});