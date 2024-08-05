import MessageRef from '@gdbots/pbj/well-known/MessageRef.js';

const ignored = {
  'apple-news-article-synced': true,
  'article-slotting-removed': true,
  'gallery-asset-reordered': true,
  'node-labels-updated': true,
  'ovp.medialive': true,
  'teaser-slotting-removed': true,
};

export default (lastEventRef, etag, node) => {
  if (etag && node.get('etag') === etag) {
    return false;
  }

  const ref = lastEventRef instanceof MessageRef ? lastEventRef : MessageRef.fromString(`${lastEventRef}`);
  const curie = ref.getCurie();
  if (ignored[curie.getPackage()] || ignored[curie.getMessage()]) {
    return false;
  }

  return true;
};
