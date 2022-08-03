import TrinitiIamException from 'plugins/iam/exceptions/TrinitiIamException';

export default class PermissionDenied extends TrinitiIamException {
  /**
   * @param {string} message
   */
  constructor(message = 'Permission denied.') {
    // 7 = PERMISSION_DENIED
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L16
    super(message, 16);
  }
}
