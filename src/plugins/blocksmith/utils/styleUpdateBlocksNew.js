import blockParentNode from './blockParentNode';

export default (block) => {
  setTimeout(() => {
    // Because each individual character is associated with an entity, it would be quite difficult
    // to make sure that each character in blocksmith block is updated as we type. So, instead of
    // doing that, just find the appropriate parent node and style that instead. Also we only have
    // access to the (multiple) spans within the block, which does not allow us to customize the
    // (parent element) visual blocks of the blocksmith.
    Array.from(document.querySelectorAll(`[data-offset-key="${block.getKey()}-0-0"]`)).forEach((node) => {
      let updateDateNode = node;
      while (!blockParentNode.is(updateDateNode.parentNode)) {
        updateDateNode = updateDateNode.parentNode;
      }
      updateDateNode.classList.add('block-update');
    });
  }, 0);
};
