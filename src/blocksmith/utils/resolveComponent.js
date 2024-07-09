import startCase from 'lodash-es/startCase.js';
import SchemaCurie from '@gdbots/pbj/SchemaCurie.js';
import { lazy } from 'react';

const components = {};
export default (curie, type) => {
  const key = `${curie}-${type}`;
  if (components[key]) {
    return components[key];
  }

  const file = startCase(SchemaCurie.fromString(curie).getMessage()).replace(/\s/g, '');
  components[key] = lazy(() => import(`@triniti/cms/blocksmith/components/${file}${type}.js`));
  return components[key];
};
