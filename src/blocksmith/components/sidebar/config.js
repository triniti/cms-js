const vendorButtonTypes = [
  'article-block',
  'audio-block',
  'divider-block',
  'document-block',
  'gallery-block',
  'heading-block',
  'image-block',
  'page-break-block',
  'poll-block',
  'poll-grid-block',
  'quote-block',
  'text-block',
  'video-block',
];

export { vendorButtonTypes };

/**
 * Config for how the sidebar buttons are displayed/organized/made searchable
 *
 *   - header will be a string in the PopoverHeader
 *   - matchRegEx is what to match in the schema message
 *   - doesMatch is whether you want to match or exclude schemas based on the matchRegEx (this
 *       could also be accomplished with a negative lookahead in matchRegEx, but this seems
 *       easier to work with)
 *   - replaceRegEx is what to replace in the button's text
 */
export default [
  {
    header: 'Social',
    matchRegEx: new RegExp('(twitter|facebook|instagram)'),
    doesMatch: true,
    replaceRegEx: new RegExp('(block)', 'g'),
  },
  {
    header: 'Other',
    matchRegEx: new RegExp(`(twitter|facebook|instagram|^(${vendorButtonTypes.join('|')}))`),
    doesMatch: false,
    replaceRegEx: new RegExp('block', 'g'),
  },
];
