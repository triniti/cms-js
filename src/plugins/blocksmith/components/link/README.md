# Link

This is the custom component used for characters with the LINK entity. Characters are decorated with this in `decorators.js`. See https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Entities.md

### Required Props
+ `children`     - Nodes to be used within the a tag. In practice these are a combination of spans - they are provided by draft.
+ `contentState` - The current Blocksmith contentState.
+ `entityKey`    - The key for this LINK entity. Used to derive the entity data payload which includes href, target, etc.

### FYI
+ Adapted from https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-anchor-plugin/src/components/Link/index.js
