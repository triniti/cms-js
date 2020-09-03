const defaultKey = 'cms.form';

const clear = (key = defaultKey) => localStorage.removeItem(key);

const get = (key = defaultKey) => {
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

const set = (form, key = defaultKey) => localStorage.setItem(key, JSON.stringify(form));

export default { clear, get, set };
