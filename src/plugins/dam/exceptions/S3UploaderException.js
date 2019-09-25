import TrinitiDamException from './TrinitiDamException';

export default class S3UploaderException extends TrinitiDamException {
  /**
   * @param {string} provider
   * @param {string} message
   */
  constructor(provider, message) {
    /**
     * fixme: Update from authentication error to S3 error
     */
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
