import test from 'tape';
import parseYouTubeId from './parseYouTubeId.js';

test('parseYouTubeId handles various inputs', (t) => {
  const testCases = [
    ['https://www.youtube.com/watch?v=KX3ZjmGbVJQ', 'KX3ZjmGbVJQ', 'Regular YouTube Video'],
    ['https://www.youtube.com/live/Uc1HsAafRy4', 'Uc1HsAafRy4', 'YouTube Live Video'],
    ['https://www.youtube.com/shorts/x9jT4DkQsms', 'x9jT4DkQsms', 'YouTube Short'],
    ['<iframe width="560" height="315" src="https://www.youtube.com/embed/HX5ZLolxyjM?si=5H3Dbd7LGbnGHy8D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>', 'HX5ZLolxyjM', 'YouTube Embed'],
    ['', '', 'Empty input'],
    ['https://example.com', 'https://example.com', 'Non-YouTube URL']
  ];

  testCases.forEach(([input, expected, description]) => {
    const actual = parseYouTubeId(input);
    t.equal(actual, expected, description);
  });
  
  t.end();
});
