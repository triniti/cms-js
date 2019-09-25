import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/iam/components/create-app-modal/Modal'), { loading: () => null });
