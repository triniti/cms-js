import isNumber from 'lodash-es/isNumber';
import moment from 'moment';

// todo: use localized format for dates (and numbers/currencies)

export default (date, format = 'MMM DD, YYYY hh:mm a') => {
  if (!date) {
    return '';
  }

  if (date.toMoment) {
    return date.toMoment().format(format);
  }

  if (isNumber(date)) {
    return moment.unix(date).format(format);
  }

  return moment(date).format(format);
};
