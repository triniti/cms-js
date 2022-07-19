/* globals DAM_BASE_URL, IMAGE_BASE_URL, VIDEO_ASSET_BASE_URL */
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export const baseUrls = {
  dfault: DAM_BASE_URL,
  image: IMAGE_BASE_URL,
  video: VIDEO_ASSET_BASE_URL,
};

/**
 * @param {NodeRef|AssetId|Message|string} id
 * @param {string} version
 * @param {string} quality
 *
 * @returns {*}
 */
export default (id, version = 'o', quality) => {
  if (!id) {
    return null;
  }

  if (id instanceof NodeRef) {
    const assetId = AssetId.fromString(id.getId());
    const baseUrl = baseUrls[assetId.getType()] || baseUrls.dfault;
    return `${baseUrl}${assetId.toFilePath(version, quality)}`;
  }

  if (id instanceof AssetId) {
    const baseUrl = baseUrls[id.getType()] || baseUrls.dfault;
    return `${baseUrl}${id.toFilePath(version, quality)}`;
  }

  if (id instanceof Message) {
    const baseUrl = baseUrls[id.get('_id').getType()] || baseUrls.dfault;
    return `${baseUrl}${id.get('_id').toFilePath(version, quality)}`;
  }

  try {
    const assetId = AssetId.fromString(`${id}`);
    const baseUrl = baseUrls[assetId.getType()] || baseUrls.dfault;
    return `${baseUrl}${assetId.toFilePath(version, quality)}`;
  } catch (e) {
    return null;
  }
};
