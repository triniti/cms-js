import PbjxEvent from '@gdbots/pbjx/events/PbjxEvent.js';

const nodeRefSym = Symbol('nodeRef');
const isMineSym = Symbol('isMine');

export default class PublishEvent extends PbjxEvent {
  /**
   * @param {Message} message - The pbj instance.
   * @param {string} nodeRef  - The nodeRef this event is associated with.
   * @param {Boolean} isMine  - If this event was caused by me.
   */
  constructor(message, nodeRef, isMine) {
    super(message);
    this[nodeRefSym] = nodeRef;
    this[isMineSym] = isMine;
  }

  /**
   * @returns {string}
   */
  getNodeRef() {
    return this[nodeRefSym];
  }

  /**
   * @returns {Boolean}
   */
  isMine() {
    return this[isMineSym];
  }

  /**
   * @param {Message} message
   *
   * @returns {PublishEvent}
   */
  createChildEvent(message) {
    const event = super.createChildEvent(message);
    event[nodeRefSym] = this.getNodeRef();
    event[isMineSym] = this.isMine();
    return event;
  }
}
