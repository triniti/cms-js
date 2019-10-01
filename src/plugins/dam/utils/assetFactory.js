import ArchiveAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/archive-asset/ArchiveAssetV1Mixin';
import AudioAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/audio-asset/AudioAssetV1Mixin';
import CodeAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/code-asset/CodeAssetV1Mixin';
import DocumentAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import VideoAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/video-asset/VideoAssetV1Mixin';
import UnknownAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/unknown-asset/UnknownAssetV1Mixin';

/**
 * Usage:
 *  `const schema = getSchema('image')`
 */
const getSchema = (() => {
  /**
   * Map containing a schema reference for each asset type
   * @access private
   */
  const schema = {};

  /**
   * Returns a cached schema from asset type
   * @param {String} type
   * @returns {Schema}
   */
  return (type) => {
    /* eslint no-return-assign: off */
    switch (type) {
      case 'archive':
        return schema[type] || (schema[type] = ArchiveAssetV1Mixin.findOne());
      case 'audio':
        return schema[type] || (schema[type] = AudioAssetV1Mixin.findOne());
      case 'code':
        return schema[type] || (schema[type] = CodeAssetV1Mixin.findOne());
      case 'document':
        return schema[type] || (schema[type] = DocumentAssetV1Mixin.findOne());
      case 'image':
        return schema[type] || (schema[type] = ImageAssetV1Mixin.findOne());
      case 'video':
        return schema[type] || (schema[type] = VideoAssetV1Mixin.findOne());
      case 'unknown':
      default:
        return schema[type] || (schema[type] = UnknownAssetV1Mixin.findOne());
    }
  };
})();

/**
 * Creates an Asset Instance from Asset Id
 *
 * @param {AssetId} assetId
 * @returns {Message}
 */
export const fromAssetId = (assetId) => {
  const schema = getSchema(assetId.getType());
  return schema.createMessage().set('_id', assetId);
};

export default fromAssetId;
