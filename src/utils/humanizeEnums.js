import isArray from 'lodash/isArray';
import lowerCase from 'lodash/lowerCase';
import startCase from 'lodash/startCase';

/**
 * Convert a triniti Enum object to a human readable format
 *
 * @param {Enum} enumObj
 * @param {Object} config, the custom configuration
 *
 * @returns {Array}
 */
export default (enumObj, config = {}) => {
  const defaultConfig = {
    except: null,
    format: 'value',
    labelKey: 'label',
    only: null,
    shouldStartCase: true, // maybe replace this with labelFormatFn and valueFormatFn?
    valueKey: 'value',
  };

  const {
    except, format, labelKey, only, shouldStartCase, valueKey,
  } = ({ ...defaultConfig, ...config });

  let result = Object.entries(enumObj.getValues());

  if (isArray(only) && only.length > 0) {
    const exclusiveEnums = only.map((item) => item.name);
    result = result.filter(([enumName]) => exclusiveEnums.includes(enumName));
  } else if (isArray(except) && except.length > 0) {
    const excludeEnums = except.map((item) => item.name);
    result = result.filter(([enumName]) => !excludeEnums.includes(enumName));
  }

  if (format === 'map') {
    return result.map((arr) => ({
      [labelKey]: shouldStartCase ? startCase(arr[1]) : lowerCase(arr[1]),
      [valueKey]: arr[1],
    }));
  }

  return result.map((arr) => (shouldStartCase ? startCase(arr[1]) : lowerCase(arr[1])));
};
