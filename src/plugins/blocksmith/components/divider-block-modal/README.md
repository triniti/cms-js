# DividerBlockModal

This is the modal that is opened by the `divider-block` `SidebarButton` (see `@triniti/cms/plugins/blocksmith/components/sidebar-buttons/divider-block-sidebar-button`) when creating a new block or by the `EditButton` (see `@triniti/cms/plugins/blocksmith/components/edit-block-button`) when editing an existing divider block.

Although this is not currently used outside of Blocksmith, it could be used to edit/create blocks in another context.

### Required Props
+ `block`        - A triniti canvas block (not a Draft.js block).
+ `toggle`       - The modal toggle function.
+ `isFreshBlock` - Whether or not we are creating a new block (true) or editing an existing block (false)
+ `onAddBlock`   - What happens when a new block is created (maps to Blocksmith's `handleAddCanvasBlock`).
+ `onEditBlock`  - What happens when an existing block is edited (maps to Blocksmith's `handleEditCanvasBlock`).

### Optional Props
+ `isOpen`       - Whether or not the modal is open.

# CustomOption

This is a custom React Select component rendered for dropdowns for `strokeStyle` and `strokeColor`. ClassNames will be dynamically applied based on your `dividerBlockConfig` and the option selected (see `.divider__color` ruleset in `demo/src/assets/styles/main.scss`) for reference. `color`, `border-top-color` and `border-top-width` css rules are required for the component to correctly render styles.

### Required Props
+ `innerProps`   - Required by React Select.
+ `data`         - Label and value for each option.

### Optional Props
+ `strokeColor`  - The current value from the state of the `DividerBlockModal`
+ `strokeStyle`  - The current value from the state of the `DividerBlockModal`

### FYI
+ See the [Triniti divider block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/divider-block).
