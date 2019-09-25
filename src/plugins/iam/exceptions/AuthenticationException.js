import TrinitiIamException from './TrinitiIamException';

export default class AuthenticationException extends TrinitiIamException {
  /**
   * @param {string} provider
   * @param {string} message
   */
  constructor(provider, message) {
    // 16 = UNAUTHENTICATED
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L17
    super(`${provider}::${message}`, 16);
    this.provider = provider;
  }

  /**
   * Returns the authentication provider that created the exception.
   *
   * @returns {string}
   */
  getProvider() {
    return this.provider;
  }
}
