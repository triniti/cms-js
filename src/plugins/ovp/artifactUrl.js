import damUrl from '@triniti/cms/plugins/dam/damUrl';
// import insertBeforeExt from '../../utils/insertBeforeExt';
import removeExt from '@triniti/cms/utils/removeExt';

// wtf?? this needs to be imported but uh idk.
import getExt from '@triniti/cms/utils/getExt';

/**
 * @param {String} fileName - A file name including extension.
 * @param {String} str      - A String to insert before the extension.
 *
 * Ex: A key of 'thylacine.mp4' and a str of '-daydream' returns 'thylacine-daydream.mp4'
 *
 * @returns {String}
 */
function insertBeforeExt (fileName, str) {
  const ext = getExt(fileName);
  return fileName.replace(new RegExp(`.${ext}$`), `${str}.${ext}`);
};

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
