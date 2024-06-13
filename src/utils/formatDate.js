import { format as formatFn } from 'date-fns';

// todo: use localized format for dates (and numbers/currencies)

export default (date, format = 'MMM dd, yyyy hh:mm a', dateOnly = false) => {
  if (!date) {
    return '';
  }

  let d = date.toDate ? date.toDate() : date;
  if (dateOnly) {
    const [year, month, day] = d.toISOString().substring(0, 10).split('-').map(Number);
    d = new Date(year, month - 1, day);
  }

  return formatFn(d, format);
};
