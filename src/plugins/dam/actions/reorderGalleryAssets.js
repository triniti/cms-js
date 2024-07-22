import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (galleryRef, gallerySeqs, oldGalleryRefs = {}) => async (dispatch, getState, app) => {
  const ReorderGalleryAssetsV1 = await MessageResolver.resolveCurie('triniti:dam:command:reorder-gallery-assets:v1');
  const pbjx = app.getPbjx();
  const command = ReorderGalleryAssetsV1.create();
  command.set('gallery_ref', galleryRef ? NodeRef.fromString(`${galleryRef}`) : null);

  for (const [assetId, seq] of Object.entries(gallerySeqs)) {
    command.addToMap('gallery_seqs', assetId, seq);
  }

  for (const [assetId, oldRef] of Object.entries(oldGalleryRefs)) {
    command.addToMap('old_gallery_refs', assetId, NodeRef.fromString(`${oldRef}`));
  }

  await pbjx.send(command);
};
