# DraggableTextBlock

This is used to render custom draggable text block inside the Blocksmith Draft.js editor by composing a DraftEditorBlock component and a few drag handle html elements.

### Optional Props
+ `block`      - instance of a `ContentBlock` class. The text block to render customizably.
+ `blockProps` - props provided to the block via blockRendererFn (notably getReadOnly).
+ `offsetKey`  - `string` type and the value to be assigned as `data-offset-key` attribute in the html.
