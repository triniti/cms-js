import MessageResolver from './schemas';
import App from '@triniti/cms/App';
import CanvasPlugin from '@triniti/cms/plugins/canvas';
import CommonPlugin from '@triniti/cms/plugins/common';
import CuratorPlugin from '@triniti/cms/plugins/curator';
import DamPlugin from '@triniti/cms/plugins/dam';
import IamPlugin from '@triniti/cms/plugins/iam';
import NcrPlugin from '@triniti/cms/plugins/ncr';
import NewsPlugin from '@triniti/cms/plugins/news';
import NotifyPlugin from '@triniti/cms/plugins/notify';
import OvpPlugin from '@triniti/cms/plugins/ovp';
import PbjxPlugin from '@triniti/cms/plugins/pbjx';
import PeoplePlugin from '@triniti/cms/plugins/people';
import RavenPlugin from '@triniti/cms/plugins/raven';
import SysPlugin from '@triniti/cms/plugins/sys';
import TaxonomyPlugin from '@triniti/cms/plugins/taxonomy';
import createPreloadedState from './config/preloadedState';

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
  new RavenPlugin,
  new SysPlugin,
  new TaxonomyPlugin,
];

export default async () => {
  const preloadedState = createPreloadedState();
  const app = new App(plugins, preloadedState);
  app.schemas = MessageResolver;
  return app;
};
