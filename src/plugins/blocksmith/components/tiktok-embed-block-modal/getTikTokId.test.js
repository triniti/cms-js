import test from 'tape';
import getTikTokId from './getTikTokId';

test('TikTokBlockEmbed', (t) => {
  const url = '6768820529194372357';
  const { id: actual } = getTikTokId(url);
  const expected = '6768820529194372357';
  t.deepEqual(actual, expected, 'it should accept a TikTok Id and return: 6768820529194372357');
  t.end();
});

test('TikTokBlockEmbed', (t) => {
  const url = 'https://www.tiktok.com/embed/6768820529194372357';
  const { id: actual } = getTikTokId(url);
  const expected = '6768820529194372357';
  t.deepEqual(actual, expected, 'it should accept a TikTok Embed URL and return: 6768820529194372357');
  t.end();
});


test('TikTokBlockEmbed', (t) => {
  const url = '<iframe width="340" height="700" src="https://www.tiktok.com/embed/6768820529194372357" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  const { id: actual } = getTikTokId(url);
  const expected = '6768820529194372357';
  t.deepEqual(actual, expected, 'it should accept a TikTok Embed and return: 6768820529194372357');
  t.end();
});
