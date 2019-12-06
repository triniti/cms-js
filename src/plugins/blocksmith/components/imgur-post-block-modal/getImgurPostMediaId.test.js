import test from 'tape';
import getImgurPostMediaId from './getImgurPostMediaId';

test('ImgurPostBlock', (t) => {
  const url = 'https://imgur.com/gallery/40I9pYU';
  const actual = getImgurPostMediaId(url);
  const expected = '40I9pYU';
  t.deepEqual(actual, expected, "it should accept an Imgur url with /gallery and return mediaId: 40I9pYU");
  t.end();
});

test('ImgurPostBlock', (t) => {
  const url = 'https://imgur.com/a/40I9pYU';
  const actual = getImgurPostMediaId(url);
  const expected = '40I9pYU';
  t.deepEqual(actual, expected, "it should accept an Imgur url with /a and return mediaId: 40I9pYU");
  t.end();
});


test('ImgurPostBlock', (t) => {
  const url = '<blockquote class="imgur-embed-pub" lang="en" data-id="a/40I9pYU"><a href="//imgur.com/40I9pYU">Aunt May is 55 Today</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>';
  const actual = getImgurPostMediaId(url);
  const expected = '40I9pYU';
  t.deepEqual(actual, expected, "it should accept an Imgur embed and return mediaId: 40I9pYU");
  t.end();
});
