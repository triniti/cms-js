/* globals VIDEO_ASSET_BASE_URL */
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
    .set('mime_type', 'application/mxf');

  let actual = artifactUrl(videoAsset, 'audio');
  let expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}.wav`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'manifest');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}.m3u8`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'original');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}-original.${ext}`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'tooltip-thumbnail-sprite');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}-tooltip-thumbnail-sprite.jpg`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'tooltip-thumbnail-track');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}-tooltip-thumbnail-track.vtt`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'transcription');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}-transcribed.json`;
  t.same(actual, expected);

  actual = artifactUrl(videoAsset, 'video');
  expected = `${VIDEO_ASSET_BASE_URL}video/cb/o/2020/07/29/${uuid}.mp4`;
  t.same(actual, expected);

  t.end();
});
