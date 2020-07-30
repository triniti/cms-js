/* globals DAM_BASE_URL */
import test from 'tape';
import AssetId from '@triniti/schemas/triniti/dam/AssetId';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import artifactUrl from './artifactUrl';

test('Ovp:util:artifactUrl', (t) => {
  const assetSchemas = AssetV1Mixin.findAll();
  const videoAssetSchema = assetSchemas[6];
  const uuid = 'cb7124f9bcf242d8a460eb23f5d7d039';
  const ext = 'mxf';
  const videoAsset = videoAssetSchema
    .createMessage()
    .set('title', 'thylacine')
    .set('_id', AssetId.fromString(`video_${ext}_20200729_${uuid}`))
    .set('mime_type', 'image/jpeg');

  let expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}.wav`;
  let actual = artifactUrl(videoAsset, 'audio');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}.m3u8`;
  actual = artifactUrl(videoAsset, 'manifest');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}-original.${ext}`;
  actual = artifactUrl(videoAsset, 'original');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}-tooltip-thumbnail-sprite.jpg`;
  actual = artifactUrl(videoAsset, 'tooltip-thumbnail-sprite');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}-tooltip-thumbnail-track.vtt`;
  actual = artifactUrl(videoAsset, 'tooltip-thumbnail-track');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}-transcribed.json`;
  actual = artifactUrl(videoAsset, 'transcription');
  t.same(expected, actual);

  expected = `${DAM_BASE_URL}video/cb/o/2020/07/29/${uuid}.mp4`;
  actual = artifactUrl(videoAsset, 'video');
  t.same(expected, actual);

  t.end();
});
