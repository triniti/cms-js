import isPlainObject from 'lodash/isPlainObject';

/**
 * create a alert obejct for alertbar
 * @param {Integer} id
 * @param {String} message
 *
 * @return {Object}
 */
const createAlert = (message) => ({
  message,
  type: 'danger',
  isDismissible: true,
  delay: false,
});

/**
 * Create alertbar alerts after a submission failed
 * @param {Object} form - redux form object
 *
 * @returns {Array}
 */
export default (form) => {
  const errors = {

    ...form.submitErrors,
    ...form.asyncErrors,
    ...form.syncErrors,
  };

  return Object.entries(errors).map((pair) => {
    const [name, error] = pair;

    let errorMessage = error;
    if (Array.isArray(error)) {
      errorMessage = error[error.length - 1];
    }

    if (isPlainObject(errorMessage)) {
      if (Object.keys(errorMessage).length) {
        return createAlert(`${name} contain(s) one or more errors`);
      }
      return null;
    }

    return createAlert(errorMessage);
  }).filter((error) => !!error);
};
