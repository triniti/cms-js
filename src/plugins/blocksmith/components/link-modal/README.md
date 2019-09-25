# LinkModal

This is the modal interface for adding, editing, and removing links in Blocksmith.

### Required Props
+ `onAddLink`    - What happens when a link is added (eg Blocksmith's handleAddLink)
+ `onRemoveLink` - What happens when a link is removed (eg Blocksmith's handleRemoveLink)
+ `toggle`       - Modal toggle function. See https://reactstrap.github.io/components/modals/

### Optional Props
+ `isOpen`       - Whether or not the modal is open. In practice this is not used in Blocksmith because the whole modal is created/torn down as needed. But, see https://reactstrap.github.io/components/modals/
+ `openInNewTab` - Whether or not the link should have `target="_blank"`
+ `url`          - The link url/href

### FYI
+ This modal is opened when the inline toolbar link button is clicked. The currently selected text is then analyzed to see if it is a link, if it is then the modal opens with that data populated such that it can be edited. 
