/* globals VIDEO_ASSET_BASE_URL */
import test from 'tape';
import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import AssetId from '@triniti/schemas/triniti/dam/AssetId.js';
import artifactUrl from './artifactUrl.js';

test('Ovp:util:artifactUrl', async (t) => {
  const videoAssetSchema = await MessageResolver.resolveCurie('*:dam:node:video-asset:v1');
  const uuid = 'cb7124f9bcf242d8a460eb23f5d7d039';
  const ext = 'mxf';
  const videoAsset = videoAssetSchema
    .create()
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
