import HelloWorker from './hello';
import RavenWorker from './raven';

// todo: replace with CLOUD_PROVIDER var
//const WORKER_PATH = CLOUD_PROVIDER === 'private' ? '/' : CLIENT_PUBLIC_PATH.split('cms').pop();
const WORKER_PATH = 'private' === 'private' ? '/' : CLIENT_PUBLIC_PATH.split('cms').pop();

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
  return `${WORKER_PATH}${path}`;
};

export default (app) => {
  const workers = {
    hello: derivePath(HelloWorker),
    raven: derivePath(RavenWorker),
  };

  app.setParameter('hello.worker', workers.hello);
  app.setParameter('raven.worker', workers.raven);

  return workers;
};
