import getCurrentNodeRef from '@triniti/cms/plugins/raven/selectors/getCurrentNodeRef.js';
import publishPbj from '@triniti/cms/plugins/pbjx/actions/publishPbj.js';

export default (pbj) => async (dispatch, getState) => {
  const state = getState();
  const currNodeRef = getCurrentNodeRef(state);

  if (currNodeRef !== `${pbj.get('node_ref')}`) {
    return;
  }

  return dispatch(publishPbj(pbj));
};
