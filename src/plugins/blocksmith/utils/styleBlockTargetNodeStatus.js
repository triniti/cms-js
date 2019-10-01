import blockParentNode from './blockParentNode';

export default (entityKey) => {
  setTimeout(() => {
    Array.from(document.querySelectorAll(`[data-entity-key="${entityKey}"]`)).forEach((node) => {
      let updateDateNode = node;
      while (!blockParentNode.is(updateDateNode.parentNode)) {
        updateDateNode = updateDateNode.parentNode;
      }
      updateDateNode.classList.add('block-not-published');
    });
  }, 0);
};
