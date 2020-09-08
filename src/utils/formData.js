const clear = (key) => localStorage.removeItem(key);

const get = (key) => {
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

const set = (form, key) => localStorage.setItem(key, JSON.stringify(form));

export default { clear, get, set };
