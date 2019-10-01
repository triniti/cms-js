import getSearchNodesState from '../../selectors/getSearchNodesState';
import { searchViewTypes } from '../../constants';

const { TABLE } = searchViewTypes;
/**
 * @param {Object} state     - The entire redux state.
 *
 * @returns {Object}
 */
export default (state, { schema: searchNodes }) => {
  const searchNodesState = getSearchNodesState(state, searchNodes.getCurie());
  return {
    view: (searchNodesState && searchNodesState.view) || TABLE,
  };
};
