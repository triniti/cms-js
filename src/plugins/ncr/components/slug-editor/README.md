# Slug Editor
This component renders the popup for updating a slug.
**This is a container component which connects to the redux store and dispatch actions.**

### Required Props
+ `nodeRef` - An instance of `NodeRef` for the node to be renamed.
+ `schema` - An instance of `Schema` to use to create commands.  Must be a schema using mixin `gdbots:ncr:mixin:rename-node`.
+ `initialSlug` - string, current slug of the node.

### How to Use
```jsx harmony
import SlugEditor from '@triniti/cms/plugins/ncr/components/slug-editor';
<SlugEditor 
  nodeRef={nodeRef}
  schema={RenameBlahSchmea}
  initialSlug={node.get('slug')}
/>
```

### delegate
`handleRename` - Function, the handler for rename a node/slug

### Actoins Types
+ `RENAME_SLUG_REQUESTED`

