import blockParentNode from 'components/blocksmith-field/utils/blockParentNode';

// todo: is there a better way to do this?
export default (block) => {
  setTimeout(() => {
    Array.from(document.querySelectorAll(`[data-offset-key="${block.getKey()}-0-0"]`)).forEach((node) => {
      let updateDateNode = node;
      while (!blockParentNode.is(updateDateNode.parentNode)) {
        updateDateNode = updateDateNode.parentNode;
      }
      updateDateNode.classList.add('block-not-published');
    });
  });
};
