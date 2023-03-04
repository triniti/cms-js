/* globals API_ENDPOINT */
import { actionTypes } from 'plugins/raven/constants';

export default (collaborations) => ({
  type: actionTypes.COLLABORATIONS_UPDATED,
  collaborations,
});