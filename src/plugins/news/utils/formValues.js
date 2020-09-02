const key = 'news.form';

const clear = () => localStorage.removeItem(key);

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

const set = (form) => localStorage.setItem(key, JSON.stringify(form));

export default { clear, get, set };
