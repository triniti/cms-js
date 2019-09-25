import test from 'tape';
import testDocument from './testDocument';
import inlineToolbar from './inlineToolbar';

test('Blocksmith:util:inlineToolbar', (t) => {
  const actual = testDocument.getInlineToolbar();
  const expected = inlineToolbar.get();
  t.equal(actual, expected, 'It should get the inline toolbar node.');

  t.end();
});
