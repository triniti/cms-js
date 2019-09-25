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
  yield call([console, 'warn'], 'unlink assets operation timed out, initiate node comparision!');

  const expectedUnlinkedAsset = pbj.get('asset_refs') && pbj.get('asset_refs')[0];

  if (!expectedUnlinkedAsset) {
    return { ok: false };
  }

  const manualCheck = yield race({
    searchAssetsResponse: yield call(searchImage, pbj.get('node_ref'), schemas),
    timeout: delay(5000),
  });

  if (manualCheck.timeout) {
    return { ok: false };
  }

  let assets = manualCheck.searchAssetsResponse.pbj.get('nodes');
  if (!assets) {
    return { ok: true };
  }

  assets = assets.map((asset) => asset.get('_id').toNodeRef().toString());

  return { ok: !assets.includes(expectedUnlinkedAsset.toString()) };
}
