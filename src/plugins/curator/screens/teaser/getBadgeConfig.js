export default (teaserType) => {
  switch (teaserType) {
    case 'article-teaser':
      return {
        imgSrc: 'book-open',
        tooltipText: 'Article Teaser',
        type: teaserType,
      };
    case 'category-teaser':
      return {
        imgSrc: 'status',
        tooltipText: 'Category Teaser',
        type: teaserType,
      };
    case 'channel-teaser':
      return {
        imgSrc: 'tag-outline-slanted',
        tooltipText: 'Channel Teaser',
        type: teaserType,
      };
    case 'gallery-teaser':
      return {
        imgSrc: 'gallery',
        tooltipText: 'Gallery Teaser',
        type: teaserType,
      };
    case 'link-teaser':
      return {
        imgSrc: 'link',
        tooltipText: 'Link Teaser',
        type: teaserType,
      };
    case 'page-teaser':
      return {
        imgSrc: 'document',
        tooltipText: 'Page Teaser',
        type: teaserType,
      };
    case 'person-teaser':
      return {
        imgSrc: 'user',
        tooltipText: 'Person Teaser',
        type: teaserType,
      };
    case 'poll-teaser':
      return {
        imgSrc: 'poll',
        tooltipText: 'Poll Teaser',
        type: teaserType,
      };
    case 'timeline-teaser':
      return {
        imgSrc: 'timeline',
        tooltipText: 'Timeline Teaser',
        type: teaserType,
      };
    case 'video-teaser':
      return {
        imgSrc: 'video',
        tooltipText: 'Video Teaser',
        type: teaserType,
      };
    case 'youtube-video-teaser':
      return {
        imgSrc: 'youtube',
        tooltipText: 'YouTube Video Teaser',
        type: teaserType,
      };
    default:
      return null;
  }
};
