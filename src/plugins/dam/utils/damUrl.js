/* globals APP_ENV, API_ENDPOINT */
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

const tld = API_ENDPOINT.split('://').pop().split('/').shift()
  .split('.')
  .slice(-2)
  .join('.');

export const baseUrls = {
  dfault: `https://dam.${APP_ENV === 'prod' ? '' : `${APP_ENV}.`}${tld}/`,
  image: `https://images${APP_ENV === 'prod' ? '.' : `-${APP_ENV}.`}${tld}/`,
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
