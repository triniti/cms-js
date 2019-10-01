# BlockButtons

These are buttons that are positioned on the active block and can be used to delete, update, or reorder said block.

### Required Props
+ `editorState` - The current Blocksmith editorState. Needed to derive information about the current blocks.
+ `onDelete` - What happens when the delete button is clicked. Just passed along to DeleteButton.
+ `onEdit` - What happens when the edit button is clicked. Just passed along to EditButton.
+ `onShiftBlock` - What happens when the shift buttons are clicked. Used in the handleShiftBlock method which is passed to ReorderButtons.

### Optional Props
+ `activeBlockKey` - The key of the active block. A block's key is set as the active key (in Blocksmith's positionComponents) when the text indicator is moved into it or when the mouse is moved over it. The ReorderButtons need this (unlike EditButton and DeleteButton) because it is added as a data attr on the drag handle. It is only technically optional because it is not set on first render and will give a warning. If it is not provided drag and drop will not work.
+ `resetFlag`      - A simple flag to determine if the shift buttons should be reset back to hidden. It is an indication that the buttons have been repositioned from one block to another and is not boolean or semantic. It is derived from the positioning of the buttons themselves and just needs to be change when the buttons are repositioned.

### FYI
+ This is positioned by Blocksmith in positionComponents.
