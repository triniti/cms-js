import decorateComponentWithProps from 'decorate-component-with-props';
import memoize from 'lodash/memoize';
import BlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/block/BlockV1Mixin';
import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';

/**
 * Gets all of the block buttons currently supported - used to populate the editor sidebar plugin.
 * Each import that needs to be overridden at the site level with babel cannot use a template
 * literal. see https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @returns {Array} the sidebar buttons.
 */
export const getAllButtons = () => BlockV1Mixin.findAll().reduce((acc, schema) => {
  switch (schema.getCurie().getMessage()) { // temp while not all blocks supported
    case 'article-block':
    case 'audio-block':
    case 'code-block':
    case 'document-block':
    case 'facebook-post-block':
    case 'facebook-video-block':
    case 'gallery-block':
    case 'google-map-block':
    case 'heading-block':
    case 'iframe-block':
    case 'image-block':
    case 'instagram-media-block':
    case 'page-break-block':
    case 'poll-block':
    case 'poll-grid-block':
    case 'quote-block':
    case 'text-block':
    case 'twitter-tweet-block':
    case 'soundcloud-audio-block':
    case 'spotify-track-block':
    case 'video-block':
    case 'vimeo-video-block':
    case 'youtube-video-block':
      // fixme: replace template literal
      // acc.push({
      //   Button: createLazyComponent(import(`@triniti/cms/plugins/blocksmith/components/${schema.getCurie().getMessage()}-sidebar-button`)),
      //   schema,
      // });
      return acc;
    default:
      return acc;
  }
}, []);

/**
 * Gets the modal for a specific block type
 *
 * @param {String} message - A triniti curie message
 *
 * @returns {?Component} a React component that is intended to go inside a Modal
 */
// fixme: replace template literal
// export const getModalComponent = memoize((message) => createLazyComponent(import(`@triniti/cms/plugins/blocksmith/components/${message}-modal`)));
export const getModalComponent = () => null;
/**
 * Gets the placeholder for a specific block type. Each import that needs to be overridden at the
 * site level with babel cannot use a template literal.
 * see https://github.com/tleunen/babel-plugin-module-resolver/issues/291
 *
 * @param {string} type - a block type eg 'code-block'
 *                        or canvasBlock.generateMessageRef().getCurie().getMessage()
 *
 * @returns {?Component} a React component that is intended to go inside the DraftJs editor
 */
// fixme: replace template literal
// export const getPlaceholder = memoize((
//   type,
//   decorator,
//   props = {},
// ) => decorator(decorateComponentWithProps(
//   createLazyComponent(import(`@triniti/cms/plugins/blocksmith/components/${type}-placeholder`)),
//   props,
// )));

export const getPlaceholder = () => null;

/**
 * Gets the preview for a specific block type
 *
 * @param {String} message - A triniti curie message
 *
 * @returns {?Component} a React component that is intended to go inside a Modal
 */
// fixme: replace template literal
// export const getPreview = memoize((message) => createLazyComponent(import(`@triniti/cms/plugins/blocksmith/components/${message}-preview`)));
export const getPreview = () => null;
