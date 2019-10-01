import TrinitiNcrException from './TrinitiNcrException';

export default class PrimaryImageRequired extends TrinitiNcrException {
  /**
   * @param {string} message
   */
  constructor(message = 'Primary Image is required.') {
    // 9 = FAILED_PRECONDITION
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L17
    super(message, 9);
  }
}
