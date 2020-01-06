import test from 'tape';
import getYoutubePlaylistIds from './getYoutubePlaylistIds';

test('getYoutubePlaylistIds', (t) => {
  const input = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  const { playlistId: actual } = getYoutubePlaylistIds(input);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, `it should accept a Youtube Playlist ID (with symbols) and return playlistId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = 'PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  const { playlistId: actual } = getYoutubePlaylistIds(input);
  const expected = 'PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  t.equal(actual, expected, `it should accept a Youtube Playlist ID (no symbols) and return playlistId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = 'https://www.youtube.com/playlist?v=0SUdTkBzVxg&list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  const { playlistId, videoId } = getYoutubePlaylistIds(input);
  let actual = playlistId;
  let expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL (with symbols in playlistId) and return playlistId: ${expected}`);
  actual = videoId;
  expected = '0SUdTkBzVxg';
  t.equal(actual, expected, 'balls');
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = 'https://www.youtube.com/playlist?list=PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  const { playlistId: actual } = getYoutubePlaylistIds(input);
  const expected = 'PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL (no symbols in playlistId) and return playlistId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = 'https://www.youtube.com/watch?v=O0YxeTjFn70&list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia&index=2&t=0s';
  const { playlistId, videoId } = getYoutubePlaylistIds(input);
  let actual = playlistId;
  let expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL (with symbols in playlistId) and return playlistId: ${expected}`);
  actual = videoId;
  expected = 'O0YxeTjFn70';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL (with symbols in playlistId) and return videoId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = 'https://www.youtube.com/watch?v=JtJTqLSzXaM&list=PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2&index=4&t=10s';
  const { playlistId, videoId } = getYoutubePlaylistIds(input);
  let actual = playlistId;
  let expected = 'PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL and return: ${expected}`);
  actual = videoId;
  expected = 'JtJTqLSzXaM';
  t.equal(actual, expected, `it should accept a Youtube Playlist URL (no symbols in playlistId) and return videoId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  const { playlistId: actual } = getYoutubePlaylistIds(input);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, `it should accept a Youtube Playlist Embed (with symbols in playlistId) and return playlistId: ${expected}`);
  t.end();
});

test('getYoutubePlaylistIds', (t) => {
  const input = '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?v=JtJTqLSzXaM&list=PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  const { playlistId, videoId } = getYoutubePlaylistIds(input);
  let actual = playlistId;
  let expected = 'PL1tiwbzkOjQxD0jjAE7PsWoaCrs0EkBH2';
  t.equal(actual, expected, `it should accept a Youtube Playlist Embed (no symbols in playlistId) and return playlistId: ${expected}`);
  actual = videoId;
  expected = 'JtJTqLSzXaM';
  t.equal(actual, expected, `it should accept a Youtube Playlist Embed (no symbols in playlistId) and return videoId: ${expected}`);
  t.end();
});
