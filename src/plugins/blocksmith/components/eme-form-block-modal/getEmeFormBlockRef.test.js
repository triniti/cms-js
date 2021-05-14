import test from 'tape';
import getEmeFormBlockRef from './getEmeFormBlockRef';

test('EmeFormBlock', (t) => {
  const formRef = 'eme:solicit:103bbf32-f3b4-415e-a85c-0735db7ca73d';
  const actual = getEmeFormBlockRef(formRef);
  const expected = 'eme:solicit:103bbf32-f3b4-415e-a85c-0735db7ca73d';
  t.deepEqual(actual, expected, 'It should accept an EME form ref.');
  t.end();
});
