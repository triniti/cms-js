# SoundcloudAudioBlockPreview

This is the preview component for `soundcloud-audio-block` blocks. It is used in:
+ The `SoundcloudAudioBlockModal` (see `@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-modal`)
+ Node preview components (eg the `ArticlePreviewModal`, see `@triniti/cms/plugins/news/components/article-preview-modal`). When used in a preview component, it is retrieved by the `resolver`'s `getPreview` function (see `@triniti/cms/plugins/blocksmith/resolver.js`).

### Required Props
+ `block` - A `soundcloud-audio-block` block (uses mixin `triniti:canvas:mixin:soundcloud-audio-block`).
+ `width` - The width of the soundcloud embed.

### FYI
+ See the [Triniti soundcloud audio block mixin](https://github.com/triniti/schemas/tree/master/schemas/triniti/canvas/mixin/soundcloud-audio-block).
