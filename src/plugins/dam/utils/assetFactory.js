import MessageResolver from '@gdbots/pbj/MessageResolver';

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
