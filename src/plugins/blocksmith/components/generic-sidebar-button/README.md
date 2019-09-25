# GenericSidebarButton

This is used to render buttons inside the Blocksmith sidebar popover (in `@triniti/cms/plugins/blocksmith/components/sidebar`). The other buttons pass their config into this.

### Required Props
+ `message`      - A message obtained from `schema.getCurie().getMessage()` eg `image-block`.
+ `onClick`      - What happens when the button is clicked. Usually this opens that block's modal, except the text-block button, which simply inserts a new empty text block (with Blocksmith's `handleHoverInsert` which is passed to the Sidebar as the `onHoverInsert` prop).
+ `replaceRegEx` - From the sidebar config, this alters the `message` prop to be a more human-friendly label.

### Optional Props
+ `config`       - An object to inform the component on how to render. Either a single icon, double icons for IconGroup, or a component. Although this is technically optional, you will want to provide it; the default is insufficient.
