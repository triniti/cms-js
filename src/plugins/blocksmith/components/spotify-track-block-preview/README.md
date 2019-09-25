# SpotifyTrackBlockPreview

This is the preview component for `spotify-track-block` blocks. It is used in:
+ The `SpotifyTrackBlockModal` (see `@triniti/cms/plugins/blocksmith/components/spotify-track-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `spotify-track-block` block (uses mixin `triniti:canvas:mixin:spotify-track-block`).

### FYI
+ See the [Triniti spotify track block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/spotify-track-block).
