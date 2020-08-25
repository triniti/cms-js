import test from 'tape';
import getImgurPostBlockId from './getImgurPostBlockId';

test('ImgurPostBlock', (t) => {
  const url = 'HRaPmbj';
  const actual = getImgurPostBlockId(url);
  const expected = 'HRaPmbj';
  t.deepEqual(actual, expected, 'it should accept an Imgur Id and return mediaId: HRaPmbj');
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = 'https://imgur.com/gallery/40I9pYU';
  const actual = getImgurPostBlockId(url);
  const expected = 'a/40I9pYU';
  t.deepEqual(actual, expected, 'it should accept an Imgur url with /gallery and return mediaId: a/40I9pYU');
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = 'https://imgur.com/a/40I9pYU';
  const actual = getImgurPostBlockId(url);
  const expected = 'a/40I9pYU';
  t.deepEqual(actual, expected, 'it should accept an Imgur url with /a and return mediaId: a/40I9pYU');
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = 'https://imgur.com/HRaPmbj';
  const actual = getImgurPostBlockId(url);
  const expected = 'HRaPmbj';
  t.deepEqual(actual, expected, 'it should accept an Imgur url with /a and return mediaId: HRaPmbj');
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = '<blockquote class="imgur-embed-pub" lang="en" data-id="a/40I9pYU"><a href="//imgur.com/40I9pYU">Aunt May is 55 Today</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>';
  const actual = getImgurPostBlockId(url);
  const expected = 'a/40I9pYU';
  t.deepEqual(actual, expected, 'it should accept an Imgur embed and return mediaId: a/40I9pYU');
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = '<blockquote class="imgur-embed-pub" lang="en" data-id="t7C8jrb"><a href="//imgur.com/t7C8jrb">&quot;I&#39;m gonna get you!&quot;</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>';
  const actual = getImgurPostBlockId(url);
  const expected = 't7C8jrb';
  t.deepEqual(actual, expected, 'it should accept an Imgur embed and return mediaId: t7C8jrb');
  t.end();
});
