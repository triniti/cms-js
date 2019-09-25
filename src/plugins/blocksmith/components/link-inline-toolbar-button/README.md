# LinkButton

This is the button inside the inline toolbar that opens the link modal.

### Required Props
+ `getEditorState`    - A function to get the current Blocksmith `editorState`. This is needed because this component does not receive props in the usual way - see `createInlineToolbarPlugin` in Blocksmith and [the plugin docs](https://www.draft-js-plugins.com/plugin/inline-toolbar).
+ `onToggleLinkModal` - A function to open the Blocksmith LinkModal.
