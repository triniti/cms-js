const key = 'news.form.values';
let invalidValues = null;

const get = () => {
  const json = localStorage.getItem(key);
  if (json) {
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  return {};
};

const set = (formValues, formErrors) => {
  const values = { ...formValues };
  const invalidFieldNames = Object.keys(formErrors);
  if (invalidFieldNames.length) {
    // cache the current values of these invalid fields so
    // to be merged later with the form's values
    invalidValues = invalidFieldNames.reduce((acc, fieldName) => ({
      ...acc,
      [fieldName]: values[fieldName],
    }), {});
    return;
  }
  localStorage.setItem(key, JSON.stringify({ ...values, ...invalidValues }));
  invalidValues = null;
};

const clear = () => {
  invalidValues = null;
  localStorage.removeItem(key);
};

export default { get, set, clear };
