import PbjxEvent from '@gdbots/pbjx/events/PbjxEvent.js';

const nameSym = Symbol('name');
const dataSym = Symbol('data');
const propsSym = Symbol('props');

export default class FormEvent extends PbjxEvent {
  /**
   * @param {Message} message - The pbj instance.
   * @param {string}} name    - The name of the form.
   * @param {Object}  data    - The initialValues for the form.
   * @param {Object}  props   - The props passed to the component.
   */
  constructor(message, name, data, props) {
    super(message);
    this[nameSym] = name;
    this[dataSym] = data;
    this[propsSym] = props;
  }

  /**
   * @returns {string}
   */
  getName() {
    return this[nameSym];
  }

  /**
   * @returns {Object}
   */
  getData() {
    return this[dataSym];
  }

  /**
   * @returns {Object}
   */
  getProps() {
    return this[propsSym];
  }

  /**
   * @param {Message} message
   *
   * @returns {FormEvent}
   */
  createChildEvent(message) {
    const event = super.createChildEvent(message);

    event[nameSym] = this.getName();
    event[dataSym] = this.getData();
    event[propsSym] = this.getProps();

    return event;
  }
}
