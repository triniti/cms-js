import throttle from 'lodash-es/throttle';
import blockParentNode from 'components/blocksmith-field/utils/blockParentNode';

const UPDATE_CLASS = 'block-update';
let styledNodes = null;

const styleUpdateBlock = (block) => {
  Array.from(document.querySelectorAll(`[data-offset-key="${block.getKey()}-0-0"]`)).forEach((node) => {
    try {
      let updateDateNode = node;
      while (!blockParentNode.is(updateDateNode.parentNode)) {
        updateDateNode = updateDateNode.parentNode;
      }
      updateDateNode.classList.add(UPDATE_CLASS);
      styledNodes.push(updateDateNode);
    } catch (e) {
      // on cut, draft may recreate its dom tree including the parent node which will cause this to
      // throw. so just clear it out and try again.
      blockParentNode.clearCache();
      styleUpdateBlock(block);
    }
  });
};

const getBlockForNode = (contentState, node) => contentState.getBlockForKey(node.getAttribute('data-offset-key').replace(/-\d-\d$/, ''));

export default {
  /**
   * clears out the tracked styled nodes.
   */
  clearCache: () => { styledNodes = null; },
  /**
   * Styles the dom nodes of blocks that have an updated_date
   *
   * @param {EditorState} editorState
   */
  style: throttle((editorState) => {
    setTimeout(() => {
      const parentNode = blockParentNode.get();
      if (!parentNode) {
        return;
      }
      const contentState = editorState.getCurrentContent();
      if (!styledNodes || (styledNodes.length && !getBlockForNode(contentState, styledNodes[0]))) {
        styledNodes = Array.from(parentNode.querySelectorAll('.block-update'));
      }
      styledNodes.forEach((node) => {
        const block = getBlockForNode(contentState, node);
        if (
          !block
          || !block.getData()
          || !block.getData().get('canvasBlock')
          || !block.getData().get('canvasBlock').has('updated_date')
        ) {
          node.classList.remove(UPDATE_CLASS);
          styledNodes = styledNodes.filter((n) => n !== node);
        }
      });
      contentState.getBlocksAsArray().forEach((block) => {
        const blockData = block.getData();
        if (blockData && blockData.get('canvasBlock') && blockData.get('canvasBlock').has('updated_date')) {
          styleUpdateBlock(block);
        }
      });
    });
  }, 500),
};
