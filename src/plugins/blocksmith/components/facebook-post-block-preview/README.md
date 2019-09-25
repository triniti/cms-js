# FacebookPostBlockPreview

This is the preview component for `facebook-post-block` blocks. It is used in:
+ The `FacebookPostBlockModal` (see `@triniti/cms/plugins/blocksmith/components/facebook-post-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `facebook-post-block` block (uses mixin `triniti:canvas:mixin:facebook-post-block`).
+ `width` - The width of the facebook post embed.

### FYI
+ See the [Triniti facebook post block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/facebook-post-block).
+ See the [Facebook embedded post docs](https://developers.facebook.com/docs/plugins/embedded-posts/)
