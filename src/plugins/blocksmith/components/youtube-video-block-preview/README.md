# YoutubeVideoBlockPreview

This is the preview component for `youtube-video-block` blocks. It is used in:
+ The `YoutubeVideoBlockModal` (see `@triniti/cms/plugins/blocksmith/components/youtube-video-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block`     - A `youtube-video-block` block (uses mixin `triniti:canvas:mixin:youtube-video-block`).
+ `width`     - The width of the vimeo video embed.

### Optional Props
+ `imageNode` - Message using mixin `triniti:dam:mixin:image-asset`, used as poster image.

### FYI
+ See the [Triniti vimeo video block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/vimeo-video-block).
+ See the [react-youtube](https://github.com/troybetz/react-youtube) docs.
+ See the [youtube iframe embed](https://developers.google.com/youtube/iframe_api_reference) docs.
