/**
 * This is a setState function.
 * It can be used to replace component-bound handlers like:
 *
 * handleChangeTime({ target: { value: time } }) {
 *   this.setState(({ updatedDate }) => ({
 *     updatedDate: updatedDate
 *       .set('hours', time ? time.split(':')[0] : 0)
 *       .set('minutes', time ? time.split(':')[1] : 0),
 *   }));
 * }
 *
 * with:
 *
 * import changedTime from '../../utils/changedTime';
 *
 * handleChangeTime({ target: { value: time } }) {
 *   this.setState(changedTime(time));
 * }
 *
 * This decouples the logic from the component, allows it to be shared, and makes testing
 * much easier.
 *
 * @link https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b
 *
 * @param {String} time - represents a time in the format hh:mm eg '14:21'
 *
 * @returns {Function}
 */

export default (time) => ({ updatedDate }) => ({
  updatedDate: updatedDate
    .set('hours', time ? time.split(':')[0] : 0)
    .set('minutes', time ? time.split(':')[1] : 0),
});
