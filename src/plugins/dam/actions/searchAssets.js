import { actionTypes } from '../constants';

export default (request) => ({
  type: actionTypes.SEARCH_ASSETS_REQUESTED,
  pbj: request,
});
