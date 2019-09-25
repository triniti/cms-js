# ReorderButtons

These are buttons that are positioned on the active block and can be used to reorder said block.

### Required Props
+ `areShiftButtonsVisible` - Whether or not the shift buttons are visible. Needs to be a prop because the parent component (BlockButtons) needs to know for positioning reasons. 
+ `isFirstBlock`           - Whether or not the active block is the first block. Needs to be a prop because the parent component (BlockButtons) needs to know for positioning reasons.
+ `isLastBlock`            - Whether or not the active block is the last block. Needs to be a prop because the parent component (BlockButtons) needs to know for positioning reasons.
+ `onShiftBlock`           - What happens when one of the shift buttons is clicked.
+ `onHideShiftButtons`     - What happens when the shift buttons are hidden. Needs to be a prop because it sets areShiftButtonsVisible.
+ `onShowShiftButtons`     - What happens when the shift buttons are shown. Needs to be a prop because it sets areShiftButtonsVisible.

### Optional Props
+ `activeBlockKey`         - The key of the active block. A block's key is set as the active key (in Blocksmith's positionComponents) when the text indicator is moved into it or when the mouse is moved over it. The ReorderButtons need this (unlike EditButton and DeleteButton) because it is added as a data attr on the drag handle. It is only technically optional because it is not set on first render and will give a warning. If it is not provided drag and drop will not work. 

### FYI
+ This is one of the BlockButtons and is positioned with the others by Blocksmith in positionComponents.
+ If there is only one block, none of the reorder buttons will appear.
+ If the active block is the first block, the shift up button will not appear.
+ If the active block is the last block, the shift down button will not appear.
+ handleDragStart is weird and non-reacty because although text blocks are react components, we do not have access to them (they are rendered by the editor according to editorState). It uses traditional event listeners, a data attribute on the drag handle, and the DataTransfer api https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer. It is unravelled in Blocksmith's handleDrop.
