import getBlocksmith from '@triniti/cms/plugins/blocksmith/selectors/getBlocksmith';
import getCopiedBlock from '../../selectors/getCopiedBlock';

/**
 * @param {Object} state - The entire redux state.
 *
 * @returns {Object}
 */
export default (state, { formName }) => {
  const blocksmithState = getBlocksmith(state, formName);
  return {
    copiedBlock: getCopiedBlock(state),
    editorState: blocksmithState && blocksmithState.editorState ? blocksmithState.editorState : null,
  };
};
