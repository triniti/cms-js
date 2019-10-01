import TrinitiRavenException from './TrinitiRavenException';

export default class ConnectionFailed extends TrinitiRavenException {
  /**
   * @param {string} message
   */
  constructor(message = 'Unable to connect to Raven provider.') {
    // 14 = UNAVAILABLE
    // @link https://github.com/gdbots/schemas/blob/master/schemas/gdbots/pbjx/enums.xml#L24
    super(message, 14);
  }
}
