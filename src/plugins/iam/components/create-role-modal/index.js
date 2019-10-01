import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/iam/components/create-role-modal/Modal'), { loading: () => null });
