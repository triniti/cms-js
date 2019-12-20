import test from 'tape';
import getYoutubePlaylistId from './getYoutubePlaylistId';

test('YoutubePlaylistBlock', (t) => {
  const url = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  const actual = getYoutubePlaylistId(url);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, 'it should accept a Youtube Playlist ID and return: PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia');
  t.end();
});

test('YoutubePlaylistBlock', (t) => {
  const url = 'https://www.youtube.com/playlist?list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  const actual = getYoutubePlaylistId(url);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, 'it should accept a Youtube Playlist URL and return: PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia');
  t.end();
});

test('YoutubePlaylistBlock', (t) => {
  const url = 'https://www.youtube.com/watch?v=O0YxeTjFn70&list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia&index=2&t=0s';
  const actual = getYoutubePlaylistId(url);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, 'it should accept a Youtube Playlist URL and return: PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia');
  t.end();
});

test('YoutubePlaylistBlock', (t) => {
  const url = '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  const actual = getYoutubePlaylistId(url);
  const expected = 'PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia';
  t.equal(actual, expected, 'it should accept a Youtube Playlist Embed and return: PL_WRY79sSYsJJHV9Bl1wd8jjJ-IrQ97Ia');
  t.end();
});
