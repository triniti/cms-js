import JsonSerializer from '@gdbots/pbj/serializers/JsonSerializer';

const key = 'iam.auth.user';
let user;

/**
 * @returns {?Message} A message using mixin 'gdbots:iam:mixin:user'
 */
const get = () => {
  if (user) {
    return user;
  }

  const json = localStorage.getItem(key);
  if (json) {
    try {
      user = JsonSerializer.deserialize(json).freeze();
      return user;
    } catch (e) {
      return null;
    }
  }

  return null;
};

/**
 * @param {Message} pbj - A message using mixin 'gdbots:iam:mixin:user'
 */
const set = (pbj) => {
  user = pbj.freeze();
  localStorage.setItem(key, `${pbj}`);
};

const clear = () => {
  user = null;
  localStorage.removeItem(key);
};

export default { get, set, clear };
