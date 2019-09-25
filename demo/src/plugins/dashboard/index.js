/* eslint-disable no-unused-vars */
import Plugin from '@triniti/app/Plugin';
import routes from './routes';

export default class DashboardPlugin extends Plugin {
  constructor() {
    super('app', 'dashboard', '0.1.0');
  }

  configure(app, bottle) {
    this.routes = routes;
  }
}
