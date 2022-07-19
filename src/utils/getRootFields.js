/**
 * Returns an array of root fields from nested paths.
 * @link https://final-form.org/docs/final-form/types/FormState#dirtyfields
 *
 * input:  ['level1.level2.level3', 'level1.level2a.level3a', 'things[].level2.level3']
 * output: ['level1', 'things']
 *
 * @param {string[]} fields
 *
 * @returns {string[]}
 */
export default (fields) => {
  const roots = {};
  for (const field of fields) {
    roots[field.split('.').shift().split('[').shift()] = true;
  }

  return Object.keys(roots);
};
