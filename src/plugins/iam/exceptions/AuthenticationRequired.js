import TrinitiIamException from 'plugins/iam/exceptions/TrinitiIamException';

export default class AuthenticationRequired extends TrinitiIamException {
  /**
   * @param {string} message
   */
  constructor(message = 'Authentication is required.') {
    // 16 = UNAUTHENTICATED
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L17
    super(message, 16);
  }
}
