import test from 'tape';
import selector from './selector';

test('create node modal selector:: default', (t) => {
  const state = {
    form: {
      'test-form': {},
    },
  };

  const selectedState = selector(state, null, { formName: 'test-form' });
  t.same(
    selectedState,
    {
      isCreateDisabled: true,
    },
    'it should return isCreateDisabled true if no form values found',
  );
  t.end();
});

test('create node modal selector:: no required field', (t) => {
  const state = {
    form: {
      'test-form': {
        values: {
          title: 'test title',
        },
      },
    },
  };

  const selectedState = selector(state, null, { formName: 'test-form' });
  t.same(
    selectedState,
    {
      formValues: { title: 'test title' },
      isCreateDisabled: false,
    },
    'it should return the formValues and set isCreateDisabled false, if formValues were found',
  );
  t.end();
});
