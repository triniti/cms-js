import TrinitiNcrException from '@triniti/cms/plugins/ncr/exceptions/TrinitiNcrException.js';

export default class PrimaryImageRequired extends TrinitiNcrException {
  constructor(message = 'Primary Image is required.') {
    // 9 = FAILED_PRECONDITION
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L17
    super(message, 9);
  }
}
