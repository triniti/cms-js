import { lazy } from 'react';

const components = {};
export default (curie, type) => {
  const key = `${curie}-${type}`;
  if (components[key]) {
    return components[key];
  }

  const file = curie.split(':').pop();
  components[key] = lazy(() => import(`@triniti/cms/blocksmith/components/${file}-${type}/index.js`));
  return components[key];
};
