import test from 'tape';
import hasFieldUpdate from './hasFieldUpdate';

const formProps = {
  initialValues: {
    title: 'some title',
    slotting: null,
    slug: 'old-slug',
  },
};

test('hasFieldUpdate tests', (t) => {
  formProps.values = {
    title: 'some title',
    slotting: [],
    slug: 'new-slug', // update in slug
  };

  let actual = hasFieldUpdate(formProps);
  let expected = true;
  t.same(actual, expected, 'should have a field update');

  let invalidFields = ['slug'];
  actual = hasFieldUpdate(formProps, invalidFields);
  expected = false;
  t.same(actual, expected, 'should NOT have a field update');

  formProps.values = {
    title: 'some title',
    slotting: [{
      key: null, // empty field
      value: 10,
    }, {
      key: 'home',
      value: 1,
    }],
    slug: 'new-slug',
  };

  formProps.registeredFields = {
    slotting: {
      type: 'FieldArray',
    },
  };

  actual = hasFieldUpdate(formProps, invalidFields);
  expected = false;
  t.same(actual, expected, 'should NOT have a field update if FieldArray has empty field items');

  formProps.values = {
    title: 'some title',
    slotting: [{
      key: 'home',
      value: 1,
    }],
    slug: 'new-slug',
  };

  actual = hasFieldUpdate(formProps, invalidFields);
  expected = true;
  t.same(actual, expected, 'should have a field update if FieldArray has no empty field items');

  formProps.values = {
    title: 'some title',
    slotting: [{
      key: 'home',
      value: 1,
    }],
    slug: 'new-slug',
  };

  invalidFields = ['slotting', 'slug'];
  actual = hasFieldUpdate(formProps, invalidFields);
  expected = false;
  t.same(actual, expected, 'should NOT have a field update');


  formProps.values = {
    title: 'some title',
    slotting: '',
    slug: 'old-slug',
  };

  actual = hasFieldUpdate(formProps);
  expected = false;
  t.same(actual, expected, 'should NOT have a field update');


  formProps.initialValues = {
    title: 'some title',
    slotting: [{
      key: 'a',
      value: 1,
    }, {
      key: 'b',
      value: 2,
    }],
    slug: 'old-slug',
  };

  formProps.values = {
    title: 'some title',
    // re-sort slotting
    slotting: [{
      key: 'b',
      value: 2,
    }, {
      key: 'a',
      value: 1,
    }],
    slug: 'old-slug',
  };

  actual = hasFieldUpdate(formProps);
  expected = true;
  t.same(actual, expected, 'should have a field update');

  actual = hasFieldUpdate(formProps, ['slotting']);
  expected = false;
  t.same(actual, expected, 'should NOT have a field update');

  formProps.values = {
    title: 'some updated title', // update title
    // update slotting
    slotting: [{
      key: 'b',
      value: 2,
    }, {
      key: 'a',
      value: 3,
    }],
    slug: 'old-slug',
  };

  actual = hasFieldUpdate(formProps, ['slotting']);
  expected = true;
  t.same(actual, expected, 'should have a field update');

  formProps.values = {
    title: 'some updated title', // update title
    // update slotting
    slotting: [{
      key: 'b',
      value: null,
    }, {
      key: 'a',
      value: 3,
    }],
    slug: 'old-slug',
  };

  actual = hasFieldUpdate(formProps); // no errors but empty field arrays
  expected = true;
  t.same(actual, expected, 'should have a field update');


  formProps.initialValues = {
    title: '       ',
    slotting: [],
    dfpCustParams: [{
      key: 'someKey',
      value: '0',
    }],
    imageRef: null,
  };

  formProps.values = {
    title: '', // emty string
    slotting: null,
    dfpCustParams: [{
      key: 'someKey',
      value: '0',
    }],
    imageRef: '',
  };

  formProps.registeredFields = {
    dfpCustParams: {
      type: 'FieldArray',
    },
    slotting: {
      type: 'FieldArray',
    },
  };

  actual = hasFieldUpdate(formProps);
  expected = false;
  t.same(actual, expected, 'should have NO field update');

  formProps.initialValues = {
    slotting: [{
      key: 'someKey',
      value: 10000,
    }],
    imageRef: null,
  };

  formProps.values = {
    slotting: [{
      key: 'someKey',
      value: 0, // we should ignore this change
    }],
    imageRef: '',
  };

  formProps.registeredFields = {
    slotting: {
      type: 'FieldArray',
    },
  };

  actual = hasFieldUpdate(formProps);
  expected = false;
  t.same(actual, expected, 'should have NO field update');


  formProps.initialValues = {
    dfpCustParams: [{
      key: 'someKey',
      value: '#$%%^^',
    }],
  };

  formProps.values = {
    dfpCustParams: [{
      key: 'someKey',
      value: '0',
    }],
  };

  formProps.registeredFields = {
    dfpCustParams: {
      type: 'FieldArray',
    },
  };

  actual = hasFieldUpdate(formProps);
  expected = true;
  t.same(actual, expected, 'should have field update');

  actual = hasFieldUpdate(formProps, ['dfpCustParams']);
  expected = false;
  t.same(actual, expected, 'should have NO field update');

  formProps.initialValues = {
    dfpCustParams: [{
      key: 'someKey',
      value: '1',
    }],
  };

  formProps.values = {
    dfpCustParams: [{
      key: 'someKey',
      value: '0', // from 1 to 0 should be ignored
    }],
  };

  actual = hasFieldUpdate(formProps);
  expected = false;
  t.same(actual, expected, 'should have NO field update');

  formProps.initialValues = {
    dfpCustParams: [{
      key: 'someKey',
      value: '100',
    }],
  };

  formProps.values = {
    dfpCustParams: [{
      key: 'someKey',
      value: '0', // update from 100 to 0
    }],
  };

  actual = hasFieldUpdate(formProps);
  expected = true;
  t.same(actual, expected, 'should have field update');

  formProps.initialValues = {
    dfpCustParams: [{
      key: 'someKey',
      value: '1',
    }],
  };

  formProps.values = {
    dfpCustParams: null,
  };

  actual = hasFieldUpdate(formProps);
  expected = true;
  t.same(actual, expected, 'should have field update');

  t.end();
});
