import { actionTypes } from '../constants';

export default (curie, view) => ({
  type: actionTypes.SEARCH_NODES_VIEW_CHANGED,
  curie,
  view,
});
