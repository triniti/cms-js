import test from 'tape';
import getSpotifyMediaId from './getSpotifyMediaId';

test('SpotifyEmbedBlock', (t) => {
  const url = 'https://open.spotify.com/show/6BRSvIBNQnB68GuoXJRCnQ/';
  const actual = getSpotifyMediaId(url);
  const expected = { id: '6BRSvIBNQnB68GuoXJRCnQ', type: 'show' };
  t.deepEqual(actual, expected, 'it should accept a Spotify URL and strip out spotify_id spotify_type and return: {"id":"6BRSvIBNQnB68GuoXJRCnQ","type":"show"}');
  t.end();
});

test('SpotifyEmbedBlock', (t) => {
  const url = 'spotify:track:3vjHuVFZGC0Bm2Ud0wNpgs';
  const actual = getSpotifyMediaId(url);
  const expected = { id: '3vjHuVFZGC0Bm2Ud0wNpgs', type: 'track' };
  t.deepEqual(actual, expected, 'it should accept a Spotify URI and strip out spotify_id and spotify_type and return : {"id":"3vjHuVFZGC0Bm2Ud0wNpgs","type":"track"}');
  t.end();
});

test('SpotifyEmbedBlock', (t) => {
  const url = '<iframe src="https://open.spotify.com/embed-podcast/show/6BRSvIBNQnB68GuoXJRCnQ/" width="100%" height="232" frameBorder="0" allowTransparency="true" allow="encrypted-media" />';
  const actual = getSpotifyMediaId(url);
  const expected = { id: '6BRSvIBNQnB68GuoXJRCnQ', type: 'show' };

  t.deepEqual(actual, expected, 'it should accept a Spotify Podcast URL and strip out spotify_id and spotify_type and return: {"id":"6BRSvIBNQnB68GuoXJRCnQ","type":"show"}');
  t.end();
});
