import isArray from 'lodash/isArray';
import JsonSerializer from '@gdbots/pbj/serializers/JsonSerializer';

const key = 'iam.auth.user.roles';
let roles;

/**
 * @returns {Array} A array of roles using mixin 'gdbots:iam:mixin:role'
 */
const get = () => {
  if (roles) {
    return roles;
  }

  const json = localStorage.getItem(key);
  if (json) {
    try {
      return JSON.parse(json).map((role) => JsonSerializer.deserialize(JSON.stringify(role)));
    } catch (e) {
      return [];
    }
  }

  return [];
};

/**
 *
 * @param userRoles - A array of roles using mixin 'gdbots:iam:mixin:role'
 */
const set = (userRoles) => {
  if (!isArray(userRoles)) {
    throw new Error('roles must be an array');
  }
  localStorage.setItem(key, JSON.stringify(userRoles));
};

const clear = () => {
  roles = null;
  localStorage.removeItem(key);
};

export default { get, set, clear };
