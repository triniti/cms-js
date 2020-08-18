import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import insertBeforeExt from '@triniti/cms/utils/insertBeforeExt';
import removeExt from '@triniti/cms/utils/removeExt';

export default (id, type) => {
  const assetUrl = damUrl(id);

  switch (type) {
    case 'audio':
      return `${removeExt(assetUrl)}.wav`;
    case 'manifest':
      return `${removeExt(assetUrl)}.m3u8`;
    case 'original':
      return insertBeforeExt(assetUrl, '-original');
    case 'tooltip-thumbnail-sprite':
      return `${removeExt(insertBeforeExt(assetUrl, '-tooltip-thumbnail-sprite'))}.jpg`;
    case 'tooltip-thumbnail-track':
      return `${removeExt(insertBeforeExt(assetUrl, '-tooltip-thumbnail-track'))}.vtt`;
    case 'transcription':
      return `${removeExt(insertBeforeExt(assetUrl, '-transcribed'))}.json`;
    case 'video':
      return `${removeExt(assetUrl)}.mp4`;
    default:
      return null;
  }
};
