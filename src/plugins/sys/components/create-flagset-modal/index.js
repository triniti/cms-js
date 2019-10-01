import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/sys/components/create-flagset-modal/Modal'), { loading: () => null });
