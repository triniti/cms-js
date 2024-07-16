import MessageResolver from './schemas.js';
import App from '@triniti/cms/App.js';
import CanvasPlugin from '@triniti/cms/plugins/canvas/index.js';
import CommonPlugin from '@triniti/cms/plugins/common/index.js';
import CuratorPlugin from '@triniti/cms/plugins/curator/index.js';
import DamPlugin from '@triniti/cms/plugins/dam/index.js';
import IamPlugin from '@triniti/cms/plugins/iam/index.js';
import NcrPlugin from '@triniti/cms/plugins/ncr/index.js';
import NewsPlugin from '@triniti/cms/plugins/news/index.js';
import NotifyPlugin from '@triniti/cms/plugins/notify/index.js';
import OvpPlugin from '@triniti/cms/plugins/ovp/index.js';
import PbjxPlugin from '@triniti/cms/plugins/pbjx/index.js';
import PeoplePlugin from '@triniti/cms/plugins/people/index.js';
//import RavenPlugin from '@triniti/cms/plugins/raven/index.js';
import SysPlugin from '@triniti/cms/plugins/sys/index.js';
import TaxonomyPlugin from '@triniti/cms/plugins/taxonomy/index.js';
import createPreloadedState from './config/preloadedState.js';

const plugins = [
  new CanvasPlugin,
  new CommonPlugin,
  new CuratorPlugin,
  new DamPlugin,
  new IamPlugin,
  new NcrPlugin,
  new NewsPlugin,
  new NotifyPlugin,
  new OvpPlugin,
  new PbjxPlugin,
  new PeoplePlugin,
  //new RavenPlugin,
  new SysPlugin,
  new TaxonomyPlugin,
];

export default async () => {
  const preloadedState = createPreloadedState();
  const app = new App(plugins, preloadedState);
  app.schemas = MessageResolver;
  return app;
};
