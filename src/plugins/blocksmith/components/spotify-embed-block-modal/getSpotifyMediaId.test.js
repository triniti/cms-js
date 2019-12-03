import test from 'tape';
import getSpotifyMediaId from './getSpotifyMediaId';

test('SpotifyEmbedBlock', (t) => {
  const url = 'https://open.spotify.com/show/6BRSvIBNQnB68GuoXJRCnQ/';
  const actual = getSpotifyMediaId(url);
  const expected = '6BRSvIBNQnB68GuoXJRCnQ';
  t.equal(actual, expected, 'it should accept a url and strip out spotify_id: 6BRSvIBNQnB68GuoXJRCnQ');
  t.end();
});


test('SpotifyEmbedBlock', (t) => {
  const url = '<iframe src="https://open.spotify.com/embed-podcast/show/6BRSvIBNQnB68GuoXJRCnQ/" width="100%" height="232" frameBorder="0" allowTransparency="true" allow="encrypted-media" />';
  const actual = getSpotifyMediaId(url);
  const expected = '6BRSvIBNQnB68GuoXJRCnQ';
  t.equal(actual, expected, 'it should accept an embed block with /embed-podcast in url and strip out spotify_id: 6BRSvIBNQnB68GuoXJRCnQ');
  t.end();
});

test('SpotifyEmbedBlock', (t) => {
  const url = '<iframe src="https://open.spotify.com/embed/track/7wak6al9Q90Upa8HzIl373/" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
  const actual = getSpotifyMediaId(url);
  const expected = '7wak6al9Q90Upa8HzIl373';
  t.equal(actual, expected, 'it should accept an embed block with /embed in url and strip out spotify_id: 7wak6al9Q90Upa8HzIl373');
  t.end();
});


test('SpotifyEmbedBlock', (t) => {
  const url = 'spotify:track:3vjHuVFZGC0Bm2Ud0wNpgs';
  const actual = getSpotifyMediaId(url);
  const expected = '3vjHuVFZGC0Bm2Ud0wNpgs';
  t.equal(actual, expected, 'it should accept an embed url formatted like spotify:type:id and strip out spotify_id: 3vjHuVFZGC0Bm2Ud0wNpgs');
  t.end();
});
