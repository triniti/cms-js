import test from 'tape';
import normalizeUnfinishedSlug from './normalizeUnfinishedSlug';

test('normalizeUnfinishedSlug', (t) => {
  const tests = [
    { slug: ' ', expected: '' },
    { slug: null, expected: '' },
    { slug: 'ಠ_ಠ', expected: '' },
    { slug: '///////', expected: '' },
    { slug: '     ', expected: '' },
    { slug: '-', expected: '' },
    { slug: 'one two three ', expected: 'one-two-three', oldSlug: '', isDatedSlug: false },
    { slug: '2019/08/21 one two three ', expected: '2019/08/21/one-two-three', oldSlug: '', isDatedSlug: true },
    { slug: '2019/08/21/a', expected: '2019/08/21/a', isDatedSlug: true },
    { slug: '2019/08/21/1', expected: '2019/08/21/1', isDatedSlug: true },
    { slug: '2019/08/21', expected: '2019/08/21/', isDatedSlug: true },
    { slug: '2019/08/21', expected: '2019/08/21', oldSlug: '2019/08/21/', isDatedSlug: true },
    { slug: '2019/10/21/one ', expected: '2019/10/21/one', oldSlug: '', isDatedSlug: true },
    { slug: '2019/10/21/one ', expected: '2019/10/21/one-', oldSlug: '2019/10/21/one', isDatedSlug: true },
    { slug: '2019/10/21/one/', expected: '2019/10/21/one', isDatedSlug: true },
    { slug: '2019/10/21/one/two/three', expected: '2019/10/21/one-two-three', isDatedSlug: true },
    { slug: '2019/10/21/one/Beyoncé/three', expected: '2019/10/21/one-beyonce-three', isDatedSlug: true },
    { slug: '2019/10/1/richard-kaltura-caption-test', expected: '2019/10/1/richard-kaltura-caption-test', isDatedSlug: true },
  ];
  tests.forEach(({ slug, expected, oldSlug = slug, isDatedSlug = false }) => {
    const actual = normalizeUnfinishedSlug(oldSlug, slug, isDatedSlug);
    t.same(actual, expected, `slug was: "${slug}".`);
  });
  t.end();
});
