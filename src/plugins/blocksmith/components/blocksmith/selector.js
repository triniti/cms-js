import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';
import JsonSerializer from '@gdbots/pbj/serializers/JsonSerializer';
import { COPIED_BLOCK_KEY } from '../../constants';

/**
 * @param {Object} state - The entire redux state.
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { formName }) => {
  const blocksmithState = getBlocksmith(state, formName);
  const json = localStorage.getItem(COPIED_BLOCK_KEY);
  let copiedBlock = null;

  if (json) {
    try {
      copiedBlock = JsonSerializer.deserialize(json).freeze();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return {
    copiedBlock,
    editorState: blocksmithState && blocksmithState.editorState ? blocksmithState.editorState : null,
  };
};
