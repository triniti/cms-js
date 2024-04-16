import startWorkers from '@triniti/cms/actions/startWorkers';

// todo: replace with CLOUD_PROVIDER var
// const WORKER_PATH = CLOUD_PROVIDER === 'private' ? '/' : CLIENT_PUBLIC_PATH.split('cms').pop();
// const WORKER_PATH = 'private' === 'private' ? '/' : CLIENT_PUBLIC_PATH.split('cms').pop();

export default (app) => {
  const workers = {
    hello: new URL('./hello.js', import.meta.url),
    raven: new URL('./raven.js', import.meta.url),
  };

  app.setParameter('hello.worker', new Worker(workers.hello, { type: 'module' }));
  app.setParameter('raven.worker', new Worker(workers.raven, { type: 'module' }));
  app.getRedux().dispatch(startWorkers(app));

  return workers;
};
