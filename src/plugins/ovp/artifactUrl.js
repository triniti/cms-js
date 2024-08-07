import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import insertBeforeExt from '@triniti/cms/utils/insertBeforeExt.js';
import removeExt from '@triniti/cms/utils/removeExt.js';

export default (id, type) => {
  const assetUrl = damUrl(id);

  switch (type) {
    case 'audio':
      return `${removeExt(assetUrl)}.wav`;
    case 'manifest':
      return `${removeExt(assetUrl)}.m3u8`;
    case 'original':
      return insertBeforeExt(assetUrl, '-original');
    case 'subtitled':
      return `${removeExt(insertBeforeExt(assetUrl, '-subtitled'))}.m3u8`;
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
