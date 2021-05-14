import test from 'tape';
import getEmeFormBlockRef from './getEmeFormBlockRef';

test('EmeFormBlock', (t) => {
  const formRef = '103bbf32-f3b4-415e-a85c-0735db7ca63d';
  const actual = getEmeFormBlockRef(formRef);
  const expected = '103bbf32-f3b4-415e-a85c-0735db7ca63d';
  t.deepEqual(actual, expected, 'It should accept an EME form ref.');
  t.end();
});
