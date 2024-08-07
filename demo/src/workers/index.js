import startWorkers from '@triniti/cms/actions/startWorkers.js';
import RavenWorker from './raven.js';

/**
 * Derives the path from the generated bundle code from webpack
 * which may look something like this:
 * return new Worker(t.p+"raven.7ed293e1.worker.js")
 * return new Worker(__webpack_require__.p + "raven.worker.js");
 *
 * This is needed because webpack worker-loader doesn't work with
 * the manifest plugin and also doesn't play nice with entry
 * points that are workers. It's a cluster ___ tbh but here we
 * are and we've got something work(ing).
 */
const derivePath = fn => {
  const [path] = fn.toString().match(/([\w]+)\.?([a-z0-9]+)?\.worker\.js/);
  return `/${path}`;
};

export default (app) => {
  const raven = new Worker(derivePath(RavenWorker));
  app.getRedux().dispatch(startWorkers(app, { raven }));
};
