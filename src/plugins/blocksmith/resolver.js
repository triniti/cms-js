import decorateComponentWithProps from 'decorate-component-with-props';
import BlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/block/BlockV1Mixin';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';

/**
 * Gets all of the block buttons currently supported - used to populate the editor sidebar plugin.
 * This cannot usetemplate literals or other expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @returns {Array} the sidebar buttons.
 */
export const getAllButtons = () => BlockV1Mixin.findAll().reduce((acc, schema) => {
  let Button;
  switch (schema.getCurie().getMessage()) {
    case 'article-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/article-block-sidebar-button'));
      break;
    case 'audio-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/audio-block-sidebar-button'));
      break;
    case 'code-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/code-block-sidebar-button'));
      break;
    case 'divider-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/divider-block-sidebar-button'));
      break;
    case 'document-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/document-block-sidebar-button'));
      break;
    case 'facebook-post-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-post-block-sidebar-button'));
      break;
    case 'facebook-video-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-video-block-sidebar-button'));
      break;
    case 'gallery-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/gallery-block-sidebar-button'));
      break;
    case 'google-map-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/google-map-block-sidebar-button'));
      break;
    case 'heading-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/heading-block-sidebar-button'));
      break;
    case 'iframe-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/iframe-block-sidebar-button'));
      break;
    case 'image-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/image-block-sidebar-button'));
      break;
    case 'instagram-media-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/instagram-media-block-sidebar-button'));
      break;
    case 'page-break-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/page-break-block-sidebar-button'));
      break;
    case 'poll-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-block-sidebar-button'));
      break;
    case 'poll-grid-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-grid-block-sidebar-button'));
      break;
    case 'quote-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/quote-block-sidebar-button'));
      break;
    case 'text-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/text-block-sidebar-button'));
      break;
    case 'twitter-tweet-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-sidebar-button'));
      break;
    case 'soundcloud-audio-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-sidebar-button'));
      break;
    case 'spotify-embed-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-embed-block-sidebar-button'));
      break;
    case 'spotify-track-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-track-block-sidebar-button'));
      break;
    case 'video-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/video-block-sidebar-button'));
      break;
    case 'vimeo-video-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/vimeo-video-block-sidebar-button'));
      break;
    case 'youtube-video-block':
      Button = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/youtube-video-block-sidebar-button'));
      break;
    default:
      break;
  }
  if (Button) {
    acc.push({
      Button,
      schema,
    });
  }
  return acc;
}, []);

/**
 * Gets the modal for a specific block type. This cannot usetemplate literals or other
 * expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {String} message - A triniti curie message
 *
 * @returns {?Component} a React component that is intended to go inside a Modal
 */
export const getModalComponent = (message) => {
  switch (message) {
    case 'article-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/article-block-modal'));
    case 'audio-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/audio-block-modal'));
    case 'code-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/code-block-modal'));
    case 'divider-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/divider-block-modal'));
    case 'document-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/document-block-modal'));
    case 'facebook-post-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-post-block-modal'));
    case 'facebook-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-video-block-modal'));
    case 'gallery-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/gallery-block-modal'));
    case 'google-map-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/google-map-block-modal'));
    case 'heading-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/heading-block-modal'));
    case 'iframe-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/iframe-block-modal'));
    case 'image-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/image-block-modal'));
    case 'instagram-media-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/instagram-media-block-modal'));
    case 'page-break-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/page-break-block-modal'));
    case 'poll-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-block-modal'));
    case 'poll-grid-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-grid-block-modal'));
    case 'quote-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/quote-block-modal'));
    case 'text-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/text-block-modal'));
    case 'twitter-tweet-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-modal'));
    case 'soundcloud-audio-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-modal'));
    case 'spotify-embed-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-embed-block-modal'));
    case 'spotify-track-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-track-block-modal'));
    case 'video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/video-block-modal'));
    case 'vimeo-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/vimeo-video-block-modal'));
    case 'youtube-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/youtube-video-block-modal'));
    default:
      return null;
  }
};

/**
 * Gets the placeholder for a specific block type. This cannot usetemplate literals or other
 * expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type - a block type eg 'code-block'
 *                        or canvasBlock.generateMessageRef().getCurie().getMessage()
 *
 * @returns {?Component} a React component that is intended to go inside the DraftJs editor
 */
export const getPlaceholder = (type, decorator, props = {}) => {
  let component = null;
  switch (type) {
    case 'article-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/article-block-placeholder'));
      break;
    case 'audio-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/audio-block-placeholder'));
      break;
    case 'code-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/code-block-placeholder'));
      break;
    case 'divider-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/divider-block-placeholder'));
      break;
    case 'document-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/document-block-placeholder'));
      break;
    case 'facebook-post-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-post-block-placeholder'));
      break;
    case 'facebook-video-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-video-block-placeholder'));
      break;
    case 'gallery-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/gallery-block-placeholder'));
      break;
    case 'google-map-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/google-map-block-placeholder'));
      break;
    case 'heading-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/heading-block-placeholder'));
      break;
    case 'iframe-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/iframe-block-placeholder'));
      break;
    case 'image-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/image-block-placeholder'));
      break;
    case 'instagram-media-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/instagram-media-block-placeholder'));
      break;
    case 'page-break-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/page-break-block-placeholder'));
      break;
    case 'poll-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-block-placeholder'));
      break;
    case 'poll-grid-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-grid-block-placeholder'));
      break;
    case 'quote-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/quote-block-placeholder'));
      break;
    case 'twitter-tweet-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-placeholder'));
      break;
    case 'soundcloud-audio-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-placeholder'));
      break;
    case 'spotify-embed-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-embed-block-placeholder'));
      break;
    case 'spotify-track-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-track-block-placeholder'));
      break;
    case 'video-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/video-block-placeholder'));
      break;
    case 'vimeo-video-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/vimeo-video-block-placeholder'));
      break;
    case 'youtube-video-block':
      component = createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/youtube-video-block-placeholder'));
      break;
    default:
      return null;
  }
  return decorator(decorateComponentWithProps(component, props));
};

/**
 * Gets the preview for a specific block type. This cannot usetemplate literals or other
 * expressions because of the module resolver.
 *
 * @link https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {String} message - A triniti curie message
 *
 * @returns {?Component} a React component that is intended to go inside a Modal
 */
export const getPreview = (message) => {
  switch (message) {
    case 'article-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/article-block-preview'));
    case 'audio-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/audio-block-preview'));
    case 'code-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/code-block-preview'));
    case 'divider-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/divider-block-preview'));
    case 'document-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/document-block-preview'));
    case 'facebook-post-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-post-block-preview'));
    case 'facebook-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/facebook-video-block-preview'));
    case 'gallery-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/gallery-block-preview'));
    case 'google-map-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/google-map-block-preview'));
    case 'heading-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/heading-block-preview'));
    case 'iframe-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/iframe-block-preview'));
    case 'image-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/image-block-preview'));
    case 'instagram-media-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/instagram-media-block-preview'));
    case 'page-break-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/page-break-block-preview'));
    case 'poll-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-block-preview'));
    case 'poll-grid-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/poll-grid-block-preview'));
    case 'quote-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/quote-block-preview'));
    case 'text-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/text-block-preview'));
    case 'twitter-tweet-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/twitter-tweet-block-preview'));
    case 'soundcloud-audio-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/soundcloud-audio-block-preview'));
    case 'spotify-embed-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-embed-block-preview'));
    case 'spotify-track-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/spotify-track-block-preview'));
    case 'video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/video-block-preview'));
    case 'vimeo-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/vimeo-video-block-preview'));
    case 'youtube-video-block':
      return createLazyComponent(import('@triniti/cms/plugins/blocksmith/components/youtube-video-block-preview'));
    default:
      return null;
  }
};
