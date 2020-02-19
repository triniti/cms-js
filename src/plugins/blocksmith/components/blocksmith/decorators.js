/**
 * Link entity decorator. Adapted from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-anchor-plugin/src
 *
 * @link https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Decorators.md
 * @link https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md#how-can-i-use-custom-decorators-with-the-plugin-editor
 */
import Link from '@triniti/cms/plugins/blocksmith/components/link';
// import Update from '@triniti/cms/plugins/blocksmith/components/update';
// import UpdateLink from '@triniti/cms/plugins/blocksmith/components/update-link';

function linkStrategy(contentBlock, cb, contentState) {
  if (!contentState) {
    return;
  }
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null
      && contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, cb);
}

// function updateStrategy(contentBlock, cb, contentState) {
//   if (!contentState) {
//     return;
//   }
//   contentBlock.findEntityRanges((character) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null
//       && contentState.getEntity(entityKey).getType() === 'UPDATE'
//     );
//   }, cb);
// }

// function updateLinkStrategy(contentBlock, cb, contentState) {
//   if (!contentState) {
//     return;
//   }
//   contentBlock.findEntityRanges((character) => {
//     const entityKey = character.getEntity();
//     return (
//       entityKey !== null
//       && contentState.getEntity(entityKey).getType() === 'UPDATE-LINK'
//     );
//   }, cb);
// }

export default [
  {
    strategy: linkStrategy,
    component: Link,
  },
  // {
  //   strategy: updateStrategy,
  //   component: Update,
  // },
  // {
  //   strategy: updateLinkStrategy,
  //   component: UpdateLink,
  // },
];
