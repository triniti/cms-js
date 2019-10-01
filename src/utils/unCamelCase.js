import startCase from 'lodash/startCase';

export default (str) => {
  const output = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');

  return startCase(output);
};
