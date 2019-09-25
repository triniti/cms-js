# TwitterTweetBlockPreview

This is the preview component for `twitter-tweet-block` blocks. It is used in:
+ The `TwitterTweetBlockModal` (see `@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `twitter-tweet-block` block (uses mixin `triniti:canvas:mixin:twitter-tweet-block`).

### FYI
+ See the [Triniti twitter tweet mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/twitter-tweet-block).
+ See the [Twitter tweet embed docs](https://dev.twitter.com/web/embedded-tweets).
