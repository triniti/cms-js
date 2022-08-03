/**
 * @param {Date} date - a date object to use to update the existing updatedDate
 *
 * @returns {Function}
 */
import moment from 'moment';

export default (date) => ({ updatedDate }) => ({
 updatedDate: moment(updatedDate)
   .set('year', date.getFullYear())
   .set('month', date.getMonth())
   .set('date', date.getDate())
   .toDate(),
});
