import TrinitiIamException from './TrinitiIamException';

export default class HttpRequestFailed extends TrinitiIamException {
  /**
   * @param {Message} envelope - The pbj envelope returned from the server.
   */
  constructor(envelope) {
    const code = envelope.get('code', 2);
    const errName = envelope.get('error_name');
    const errMessage = envelope.get('error_message');
    super(`${errName}::${code}::${errMessage}`, code);
    this.envelope = envelope;
  }

  /**
   * @returns {Message}
   */
  getEnvelope() {
    return this.envelope;
  }
}
