export default (screenType, schemas) => {
  const assetType = schemas.nodes
    .find((schema) => schema.getCurie().getMessage() === screenType)
    .getCurie().getMessage();

  switch (assetType) {
    case 'archive-asset':
      return {
        imgSrc: 'archive',
        tooltipText: 'Archive Asset',
        type: assetType,
      };
    case 'audio-asset':
      return {
        imgSrc: 'audio',
        tooltipText: 'Audio Asset',
        type: assetType,
      };
    case 'code-asset':
      return {
        imgSrc: 'code',
        tooltipText: 'Code Asset',
        type: assetType,
      };
    case 'document-asset':
      return {
        imgSrc: 'document',
        tooltipText: 'Document Asset',
        type: assetType,
      };
    case 'image-asset':
      return {
        imgSrc: 'camera',
        tooltipText: 'Image Asset',
        type: assetType,
      };
    case 'unknown-asset':
      return {
        imgSrc: 'unknown',
        tooltipText: 'Unknown Asset',
        type: assetType,
      };
    case 'video-asset':
      return {
        imgSrc: 'video',
        tooltipText: 'Video Asset',
        type: assetType,
      };
    default:
      return null;
  }
};
