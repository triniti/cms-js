import getPolicy from '@triniti/cms/plugins/iam/selectors/getPolicy.js';

export default class LockableEnricher {
  constructor(app) {
    this.app = app;
  }

  enrichSearchArticles(event) {
    const request = event.getMessage();
    const policy = this.app.select(getPolicy);
    if (!policy.isGranted(`${APP_VENDOR}:article:unlock`)) {
      // only include articles that are not locked (2 = false)
      request.set('is_locked', 2);
    }
  }
}
