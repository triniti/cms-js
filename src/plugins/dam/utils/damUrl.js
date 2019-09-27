/* globals APP_ENV, API_ENDPOINT, APP_VENDOR */
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

const tld = API_ENDPOINT.split('://').pop().split('/').shift()
  .split('.')
  .slice(-2)
  .join('.');

const defaultBaseUrl = `https://dam.${APP_ENV === 'prod' ? '' : `${APP_ENV}.`}${tld}/`;
const imageBaseUrl = `https://${APP_VENDOR}-images${APP_ENV === 'prod' ? '.' : `-${APP_ENV}.`}akamaized.net/`;

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
    const baseUrl = id.getLabel() === 'image-asset' ? imageBaseUrl : defaultBaseUrl;
    return `${baseUrl}${AssetId.fromString(id.getId()).toFilePath(version, quality)}`;
  }

  if (id instanceof AssetId) {
    const baseUrl = id.getType() === 'image' ? imageBaseUrl : defaultBaseUrl;
    return `${baseUrl}${id.toFilePath(version, quality)}`;
  }

  if (id instanceof Message) {
    const baseUrl = id.get('_id').getType() === 'image' ? imageBaseUrl : defaultBaseUrl;
    return `${baseUrl}${id.get('_id').toFilePath(version, quality)}`;
  }

  try {
    const assetId = AssetId.fromString(String(id));
    const baseUrl = assetId.getType() === 'image' ? imageBaseUrl : defaultBaseUrl;
    return `${baseUrl}${assetId.toFilePath(version, quality)}`;
  } catch (e) {
    return null;
  }
};
