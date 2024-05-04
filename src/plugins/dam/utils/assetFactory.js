import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';

export const fromNodeRef = async (nodeRef) => {
  const assetId = AssetId.fromString(nodeRef);
  return await fromAssetId(assetId);
}


/**
 * Creates an Asset Instance from Asset Id
 *
 * @param {AssetId} assetId
 * @returns {Message}
 */
export const fromAssetId = async (assetId) => {
  const message = await MessageResolver.resolveCurie(`*:dam:node:${assetId.type}-asset:v1`);
  return message.create().set('_id', assetId);
};

export default fromAssetId;
