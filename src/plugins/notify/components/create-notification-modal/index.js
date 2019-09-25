import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(
  import('@triniti/cms/plugins/notify/components/create-notification-modal/Modal'),
  { loading: () => null },
);
