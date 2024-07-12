import fastDeepEqual from 'fast-deep-equal/es6/index.js';
import omit from 'lodash-es/omit.js';
import { BLOCKSMITH_DIRTY } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

const omitKeys = ['etag'];

export default (a, b) => {
  if (a === b) {
    return true;
  }

  if (a === BLOCKSMITH_DIRTY || b === BLOCKSMITH_DIRTY) {
    return false;
  }

  const left = (a || []).map(v => omit(v, omitKeys));
  const right = (b || []).map(v => omit(v, omitKeys));
  return fastDeepEqual(left, right);
};
