import InvalidArgumentException from '@triniti/cms/exceptions/InvalidArgumentException.js';

const wildcard = '*';
const delimiter = ':';

/**
 * @private
 *
 * Converts an action with potentially colon delimiters
 * into a set of permissions to check for.
 *
 * @example
 * An action of "acme:blog:command:publish-article" becomes
 * an array of:
 * [
 *  '*',
 *  'acme:*',
 *  'acme:blog:*',
 *  'acme:blog:command:*',
 *  'acme:blog:command:publish-article',
 * ]
 *
 * @param {string} action
 *
 * @returns {string[]}
 */
const getRules = (action) => {
  const rules = [];
  const parts = action.split(delimiter);

  while (parts.pop()) {
    rules.push(parts.join(delimiter) + delimiter + wildcard);
  }
  rules.reverse();
  rules[0] = rules[0].replace(delimiter, '');
  rules.push(action);

  return rules;
};

export default class Policy {
  /**
   * @param {Message[]} roles - An array of messages using mixin 'gdbots:iam:mixin:role'
   */
  constructor(roles = []) {
    Object.defineProperty(this, 'roles', { value: {} });
    Object.defineProperty(this, 'allowed', { value: {} });
    Object.defineProperty(this, 'denied', { value: {} });

    roles.forEach((role) => {
      this.roles[role.get('_id').toString()] = role;
      role.get('allowed', []).forEach((rule) => {
        this.allowed[rule] = true;
      });
      role.get('denied', []).forEach((rule) => {
        this.denied[rule] = true;
      });
    });

    Object.freeze(this);
  }

  /**
   * @param {Identifier|string} id
   *
   * @returns {boolean}
   */
  hasRole(id) {
    const role = this.roles[`${id}`] || undefined;
    return typeof role !== 'undefined';
  }

  /**
   * @param {string} action
   *
   * @returns {boolean}
   */
  isGranted(action) {
    if (Object.keys(this.allowed).length === 0) {
      return false;
    }

    if (this.denied[wildcard] || this.denied[action]) {
      return false;
    }

    const rules = getRules(action);
    const len = rules.length;

    for (let i = 0; i < len; i += 1) {
      if (this.denied[rules[i]]) {
        return false;
      }
    }

    for (let i = 0; i < len; i += 1) {
      if (this.allowed[rules[i]]) {
        return true;
      }
    }

    return false;
  }

  /**
   * @param {Object} obj
   *
   * @returns {Policy}
   */
  static fromObject(obj = {}) {
    return new Policy(obj.roles || []);
  }

  /**
   * @param {string} json
   *
   * @returns {Policy}
   */
  static fromJSON(json) {
    let obj;

    try {
      obj = JSON.parse(json);
    } catch (e) {
      throw new InvalidArgumentException('Invalid JSON.');
    }

    return this.fromObject(obj);
  }

  /**
   * @returns {string}
   */
  toString() {
    return JSON.stringify(this);
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * @returns {Object}
   */
  toObject() {
    return {
      roles: Object.values(this.roles),
      allowed: Object.keys(this.allowed),
      denied: Object.keys(this.denied),
    };
  }
}
