import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/sys/components/create-redirect-modal/Modal'), { loading: () => null });
