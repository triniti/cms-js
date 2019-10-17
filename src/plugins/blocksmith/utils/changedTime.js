/**
 * @param {String} time - represents a time in the format hh:mm eg '14:21'
 *
 * @returns {Function}
 */
import moment from 'moment';

export default (time) => ({ updatedDate }) => ({
  updatedDate: moment(updatedDate)
    .set('hours', time ? time.split(':')[0] : 0)
    .set('minutes', time ? time.split(':')[1] : 0)
    .toDate(),
});
