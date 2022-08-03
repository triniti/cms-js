/**
 * Link entity decorator. Adapted from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-anchor-plugin/src
 *
 * @link https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Decorators.md
 * @link https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md#how-can-i-use-custom-decorators-with-the-plugin-editor
 */
import Link from 'components/blocksmith-field/components/link';
import { entityTypes } from 'components/blocksmith-field/constants';

function linkStrategy(contentBlock, cb, contentState) {
 if (!contentState) {
   return;
 }
 contentBlock.findEntityRanges((character) => {
   const entityKey = character.getEntity();
   return (
     entityKey !== null
     && contentState.getEntity(entityKey).getType() === entityTypes.LINK
   );
 }, cb);
}

export default [
 {
   strategy: linkStrategy,
   component: Link,
 },
];
