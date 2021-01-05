import test from 'tape';
import getFacebookPostUrl from './getFacebookPostUrl';

const isValidUrl = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

// list ref: https://developers.facebook.com/docs/plugins/oembed
const validFacebookEmbedCodes = [
  '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsomepage%2Fphotos%2Fa.223174631886627%2F593811121489641%2F%3Ftype%3D3&width=500" width="500" height="501" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>',
  '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsomepage%2Fphotos%2Fa.223174631886627%2F593811121489641%2F&width=500&show_text=true&appId=120311904787444&height=497" width="500" height="497" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>',
  '<div class="fb-post" data-href="https://www.facebook.com/some-page/photos/a.223174631886627/593811121489641/" data-width="500" data-show-text="true"><blockquote cite="https://www.facebook.com/some-page/photos/a.223174631886627/593811121489641/?type=3" class="fb-xfbml-parse-ignore">Posted by <a href="https://www.facebook.com/some-page/">Omaha Scanner</a> on&nbsp;<a href="https://www.facebook.com/some-page/photos/a.223174631886627/593811121489641/?type=3">Tuesday, May 19, 2020</a></blockquote></div>',
  'https://www.facebook.com/some-pagename/posts/34324234',
  'https://www.facebook.com/some-pagename/posts/34324234/?data-show-text=1222',
  'https://www.facebook.com/some-username/posts/1233445',
  'https://www.facebook.com/some-username/activity/34344/?show_text=true',
  'https://www.facebook.com/photo.php?fbid=1313131&set=a.3686775011357',
  'https://www.facebook.com/photo/?fbid=1313131&set=a.3686775011357', // added variation with extra common slash before query
  'https://www.facebook.com/photos/23432423',
  'https://www.facebook.com/permalink.php?story_fbid=322342&id=242222342',
  'https://www.facebook.com/permalink.php/?story_fbid=322342&id=242222342',
  'https://www.facebook.com/media/set?set=23424242',
  'https://www.facebook.com/media/set/?set=1231231',
  'https://www.facebook.com/questions/13123131',
  'https://www.facebook.com/notes/some-username/some-note-url/122222222',
  'https://www.facebook.com/some-page/photos/a.223174631886627/593811121489641/?type=3',
];

const inValidFacebookEmbedCodes = [
  '     ',
  '------++++++',
  '',
  '**/%%%******/facebook.com', // malformed URI sequence and will throw an error if not caught
  null,
  undefined,
  '<iframe src="**/%%%******/invalid" width="500" height="501" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>',
  '<iframe src="https://www.facebook.com/plugins/post.php?href=“https://www.facebook.com/some-username/posts/?12222333" width="500" height="501" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>',
  '<div class="fb-post" data-href="https://www.facebook.com/some-username/activity/?34344" data-width="500" data-show-text="true"><blockquote class="fb-xfbml-parse-ignore">Posted by <a href="#" role="button">username</a> on&nbsp;<a href="https://www.facebook.com/some-username/activity/?34344">Thursday, December 31, 2020</a></blockquote></div>',
  'https://www.fb.me/questions/13123131',
  'https://www.fb.me/some-username/posts/34324234',
  'https://www.facebook.com/some-username/posts/?12222333',
  'https://www.facebook.com/some-username/activity/?34344',
  'https://www.facebook.com/posts/?34324234',
  'https://www.facebook.com/some-username/posts/hello', // invalid post id
  'https://www.facebook.com/some-username/activities/34344',
  'https://www.facebook.com/activity/34344',
  'https://www.facebook.com/photo.php?id=1313131',
  'https://www.facebook.com/photo.php?fbid=hello', // invalid fbid
  'https://www.facebook.com/photos.php/23432423',
  'https://www.facebook.com/permalink.php?story_fbid=322342', // mising query string `id`
  'https://www.facebook.com/media/set?sets=23424242', // unsupported querystring
  'https://www.facebook.com/media/?set=23424242',
  'https://www.facebook.com/notes/some-note-url/122222222',
  'https://www.facebook.com/questions/?13123131',
  'https://www.facebook.com/group/notes/some-note-url/some-username/122222222',
  'https://www.facebook.com/notes/some-username/some-note-url/?122222222',
  'https://www.facebook.com/some-page/photos/a.223174631886627/?593811121489641/?type=3',
];

test('getFacebookPostUrl::[valid]', (t) => {
  validFacebookEmbedCodes.forEach((code) => {
    const extractedUrl = getFacebookPostUrl(code);
    t.true(!!extractedUrl && isValidUrl(extractedUrl), `it should return a VALID facebook post url - ${code}`);
  });
  t.end();
});

test('getFacebookPostUrl::[invalid]', (t) => {
  inValidFacebookEmbedCodes.forEach((code) => {
    t.true(!getFacebookPostUrl(code), `it should NOT return a facebook post url - ${code}`);
  });
  t.end();
});
