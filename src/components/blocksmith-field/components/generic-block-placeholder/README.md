

# GenericPlaceholder

This is used to render block placeholders inside the Blocksmith Draft.js editor. See https://draftjs.org/docs/advanced-topics-block-components.html. The other buttons pass their config into this.

### Optional Props
+ `config` - An object to inform the component on how to render. Either a single icon, double icons for IconGroup, or a component. Although this is technically optional, you will want to provide it; the default is insufficient.
+ `draggable` - boolean property and toggles `draggable` attribute.
+ `label`  - When using a preview component, this label will come from that button's selector and will include the schema's vendor name.
+ `node`   - When using a preview component, this node will come from that button's selector.

### Subcomponent
#### 1. ImagePreview - 
 Renders a large closable image preview wrapped in a bubble div.

##### Required props
+ `onDismissImagePreview` - a function to close/hide the component.
+ `src`   - a string and represents the url path of the image to display.
