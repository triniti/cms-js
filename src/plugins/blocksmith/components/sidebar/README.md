# Sidebar

This is the popup sidebar/popover that contains the buttons used to add various types of blocks.

### Required Props
+ `isOpen`            - Whether or not the Sidebar is open/visible.
+ `onHoverInsert`     - Same as Blocksmith's handleHoverInsert. Used when the text-block button is clicked, because it has the same functionality as clicking the hover insert line.
+ `onToggleModal`     - What happens when the modal is launched. There is a dedicated modal for each button in the Sidebar.
+ `onToggleSidebar`   - What happens when the Sidebar icon itself is clicked.
+ `resetFlag`         - A flag to determine when the button search query should be reset, generally when a block has been added.

### Optional Props
+ `isHoverInsertMode` - Whether or not the sidebar is in hover insert mode. This is when it appears between blocks, with a line that stretches across. Clicking the line adds a new empty block in that location.

### FYI
+ The button sections are customizable in `config.js` but the first section is always the vendor-specific section. That section is added in the component itself.
+ The only button that does not open a modal is the text-block button. See `onHoverInsert` above.
