import { call, delay, putResolve, race } from 'redux-saga/effects';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';

/**
 * @param nodeRef
 * @param schemas
 * @returns {Message} SearchAssetsResponse
 */
function* searchImage(nodeRef, schemas) {
  const message = schemas.searchNodesRequest.createMessage()
    .set('linked_ref', nodeRef)
    .set('status', NodeStatus.PUBLISHED)
    .addToSet('types', ['image-asset'])
    .set('count', 150);

  return yield putResolve(message);
}

/**
 * @param {Message} pbj - LinkAssetsRequest
 * @param {Object} schemas
 * @returns {Object}
 */
export default function* linkAssetsTimedoutFlow(pbj, schemas) {
  yield delay(3000);
  yield call([console, 'warn'], 'link assets operation timed out, initiate node comparision!');

  const expectedLinkedAssets = pbj.get('asset_refs');
  const manualCheck = yield race({
    searchAssetsResponse: yield call(searchImage, pbj.get('node_ref'), schemas),
    timeout: delay(5000),
  });

  if (manualCheck.timeout) {
    return { ok: false };
  }

  const assets = (manualCheck.searchAssetsResponse.pbj.get('nodes') || [])
    .map((asset) => asset.get('_id').toNodeRef().toString());

  let failedImages = 0;
  for (let i = 0; i < expectedLinkedAssets.length; i += 1) {
    if (!assets.includes(expectedLinkedAssets[i].toString())) {
      failedImages += 1;
    }
  }

  if (failedImages) {
    return { ok: false, failedImages };
  }

  return { ok: true };
}
