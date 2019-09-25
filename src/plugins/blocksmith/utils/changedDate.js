/**
 * This is a setState function.
 * It can be used to replace component-bound handlers like:
 *
 * handleChangeDate(date) {
 *   const { updatedDate } = this.state;
 *   this.setState({
 *     updatedDate: updatedDate
 *       .set('year', date.getFullYear())
 *       .set('month', date.getMonth())
 *       .set('date', date.getDate()),
 *   });
 * }
 *
 * with:
 *
 * import changedDate from '../../utils/changedDate';
 *
 * handleChangeDate(date) {
 *   this.setState(changedDate(date));
 * }
 *
 * This decouples the logic from the component, allows it to be shared, and makes testing
 * much easier.
 *
 * @link https://medium.freecodecamp.org/functional-setstate-is-the-future-of-react-374f30401b6b
 *
 * @param {Date} date - a date object to use to update the existing updatedDate
 *
 * @returns {Function}
 */

export default (date) => ({ updatedDate }) => ({
  updatedDate: updatedDate
    .set('year', date.getFullYear())
    .set('month', date.getMonth())
    .set('date', date.getDate()),
});
