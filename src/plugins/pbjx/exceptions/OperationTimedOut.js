import TrinitiPbjxException from './TrinitiPbjxException';

export default class OperationTimedOut extends TrinitiPbjxException {
  /**
   * @param {Message} pbj
   * @param {string} message
   */
  constructor(pbj, message = 'Pbjx operation timed out.') {
    // 4 = DEADLINE_EXCEEDED,
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L13
    super(message, 4);
    this.pbj = pbj;
  }

  /**
   * Returns the pbj that created the exception.
   *
   * @returns {Message}
   */
  getPbj() {
    return this.pbj;
  }
}
