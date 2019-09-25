import { actionTypes } from '../constants';

export default (request, channel = 'root') => ({
  type: actionTypes.SEARCH_NODES_REQUESTED,
  pbj: request,
  channel,
});
