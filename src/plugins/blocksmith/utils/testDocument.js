import 'jsdom-global/register';

let initialized = false;
let blockParentNode;
let blockParentChild;
let blockParentChildChild;
let inlineToolbar;
let nonContainedNode;

function init() {
  if (!initialized) {
    initialized = true;
    document.body.innerHTML = '<div></div>';

    blockParentNode = document.createElement('div');
    blockParentNode.setAttribute('data-contents', 'true');
    document.body.appendChild(blockParentNode);

    blockParentChild = document.createElement('div');
    blockParentChild.setAttribute('id', 'parent-child');
    blockParentNode.appendChild(blockParentChild);

    blockParentChildChild = document.createElement('div');
    blockParentChildChild.setAttribute('id', 'parent-child-child');
    blockParentChild.appendChild(blockParentChildChild);

    inlineToolbar = document.createElement('div');
    inlineToolbar.setAttribute('class', 'inline-toolbar');
    document.body.appendChild(inlineToolbar);

    nonContainedNode = document.createElement('div');
    nonContainedNode.setAttribute('id', 'not-a-parent-child');
    document.body.appendChild(nonContainedNode);
  }
}

export default {
  getBlockParentNode: () => {
    if (!blockParentNode) {
      init();
    }
    return blockParentNode;
  },
  getBlockParentChild: () => {
    if (!blockParentChild) {
      init();
    }
    return blockParentChild;
  },
  getBlockParentChildChild: () => {
    if (!blockParentChildChild) {
      init();
    }
    return blockParentChildChild;
  },
  getInlineToolbar: () => {
    if (!inlineToolbar) {
      init();
    }
    return inlineToolbar;
  },
  getNonContainedNode: () => {
    if (!nonContainedNode) {
      init();
    }
    return nonContainedNode;
  },
};
