import blockParentNode from './blockParentNode';

const styleUpdateBlock = (block) => {
  Array.from(document.querySelectorAll(`[data-offset-key="${block.getKey()}-0-0"]`)).forEach((node) => {
    let updateDateNode = node;
    while (!blockParentNode.is(updateDateNode.parentNode)) {
      updateDateNode = updateDateNode.parentNode;
    }
    updateDateNode.classList.add('block-update');
  });
};

export default (editorState) => {
  setTimeout(() => {
    const parentNode = blockParentNode.get();
    if (!parentNode) {
      return;
    }
    const contentState = editorState.getCurrentContent();
    Array.from(parentNode.querySelectorAll('.block-update')).forEach((node) => {
      const block = contentState.getBlockForKey(node.getAttribute('data-offset-key').replace(/-\d-\d$/, ''));
      const blockData = block.getData();
      if (!blockData || !blockData.get('canvasBlock') || !blockData.get('canvasBlock').has('updated_date')) {
        node.classList.remove('block-update');
      }
    });
    contentState.getBlocksAsArray().forEach((block) => {
      const blockData = block.getData();
      if (blockData && blockData.get('canvasBlock') && blockData.get('canvasBlock').has('updated_date')) {
        styleUpdateBlock(block);
      }
    });
  }, 0);
};
