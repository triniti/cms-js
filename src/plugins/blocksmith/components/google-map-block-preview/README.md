# GoogleMapBlockPreview

This is the preview component for `google-map-block` blocks. It is used in:
+ The `GoogleMapBlockModal` (see `@triniti/cms/plugins/blocksmith/components/google-map-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required props
+ `block` - A `google-map-block` block (uses mixin `triniti:canvas:mixin:google-map-block`).
+ `width` - The width of the google map embed.

### FYI
+ See the [Triniti google map block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/google-map-block).
+ See the [Google map iframe docs](https://developers.google.com/maps/documentation/embed/guide)
