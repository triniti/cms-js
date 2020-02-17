import test from 'tape';
import getTwitterTweetFields from './getTwitterTweetFields';

test('Blocksmith.component.twitter-tweet-modal:getTwitterTweetFields', (t) => {
  const embed = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Join the revolution:<a href="https://t.co/CJxMU0iRwC">https://t.co/CJxMU0iRwC</a><a href="https://twitter.com/hashtag/NoDeployFridays?src=hash&amp;ref_src=twsrc%5Etfw">#NoDeployFridays</a> <a href="https://t.co/K5IzSANRL1">pic.twitter.com/K5IzSANRL1</a></p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1108993784132587520?ref_src=twsrc%5Etfw">March 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const { screenName, tweetId, tweetText } = getTwitterTweetFields(embed);
  let actual = screenName;
  let expected = 'iamdevloper';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return screenName: ${expected}`);

  actual = tweetId;
  expected = '1108993784132587520';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetId: ${expected}`);

  actual = tweetText;
  expected = '<p lang="en" dir="ltr">Join the revolution:<a href="https://t.co/CJxMU0iRwC">https://t.co/CJxMU0iRwC</a><a href="https://twitter.com/hashtag/NoDeployFridays?src=hash&amp;ref_src=twsrc^tfw">#NoDeployFridays</a> <a href="https://t.co/K5IzSANRL1">pic.twitter.com/K5IzSANRL1</a></p>&mdash; I Am Devloper (@iamdevloper) <a href="https://twitter.com/iamdevloper/status/1108993784132587520?ref_src=twsrc^tfw">March 22, 2019</a>';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetText: ${expected}`);

  t.end();
});

test('Blocksmith.component.twitter-tweet-modal:getTwitterTweetFields', (t) => {
  const embed = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">1000% False.<br><br>Bold-Faced Lie.<br><br>I did not, have not, and would not utter a racial-slur.<br><br>This is a disgusting and reckless attempt to assassinate my character. <a href="https://t.co/mZcEcC0tCl">https://t.co/mZcEcC0tCl</a></p>&mdash; Mason Rudolph (@Rudolph2Mason) <a href="https://twitter.com/Rudolph2Mason/status/1228691160396230656?ref_src=twsrc%5Etfw">February 15, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
  const { screenName, tweetId, tweetText } = getTwitterTweetFields(embed);
  let actual = screenName;
  let expected = 'Rudolph2Mason';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return screenName: ${expected}`);

  actual = tweetId;
  expected = '1228691160396230656';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetId: ${expected}`);

  actual = tweetText;
  expected = '<p lang="en" dir="ltr">1000% False.<br><br>Bold-Faced Lie.<br><br>I did not, have not, and would not utter a racial-slur.<br><br>This is a disgusting and reckless attempt to assassinate my character. <a href="https://t.co/mZcEcC0tCl">https://t.co/mZcEcC0tCl</a></p>&mdash; Mason Rudolph (@Rudolph2Mason) <a href="https://twitter.com/Rudolph2Mason/status/1228691160396230656?ref_src=twsrc^tfw">February 15, 2020</a>';
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetText: ${expected}`);

  t.end();
});

test('Blocksmith.component.twitter-tweet-modal:getTwitterTweetFields', (t) => {
  const embed = 'invalid';
  const { screenName, tweetId, tweetText } = getTwitterTweetFields(embed);
  let actual = screenName;
  let expected = null;
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return screenName: ${expected}`);

  actual = tweetId;
  expected = null;
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetId: ${expected}`);

  actual = tweetText;
  expected = null;
  t.deepEqual(actual, expected, `it should accept a Twitter Tweet embed and return tweetText: ${expected}`);

  t.end();
});
