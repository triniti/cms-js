import TrinitiIamException from '@triniti/cms/plugins/iam/exceptions/TrinitiIamException.js';

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
