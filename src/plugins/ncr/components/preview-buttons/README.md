# PreviewLinkButton
Component will render a link button that opens a url to preview the subject node.

### Props
+ `node` - instance of `Message` and the subject to preview.

### How to Use
```jsx harmony
import PreviewButtons from '@triniti/cms/plugins/ncr/components/preview-buttons';

const article = delegate.getNode(); // some function to retrieve node
<PreviewButtons
node={node}
/>
```
