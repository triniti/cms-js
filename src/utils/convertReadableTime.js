import moment from 'moment/moment';

export default (timeObj = null) => {
  if (!timeObj) {
    return '';
  }

  // a Microtime object (useful for created_at)
  if (typeof timeObj.toMoment === 'function') {
    return timeObj.toMoment().format('MMM DD, YYYY hh:mm A');
  }

  // a Unix timestamp (useful for updated_at)
  if (typeof timeObj === 'number') {
    return moment.unix(timeObj).format('MMM DD, YYYY hh:mm A');
  }

  // useful for published_at
  return moment(timeObj).format('MMM DD, YYYY hh:mm A');
};
