import LogicException from '@triniti/cms/exceptions/LogicException';

export default class ServiceNotFound extends LogicException {
  /**
   * @param {string} id
   */
  constructor(id) {
    super(`Service [${id}] was not found.`);
    this.id = id;
  }

  /**
   * @returns {string}
   */
  getId() {
    return this.id;
  }
}
