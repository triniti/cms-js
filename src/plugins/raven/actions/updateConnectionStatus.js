/* globals API_ENDPOINT */
import { actionTypes } from '../constants';

export default (status) => ({
  type: actionTypes.CONNECTION_UPDATED,
  status,
});