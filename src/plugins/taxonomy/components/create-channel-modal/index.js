import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/taxonomy/components/create-channel-modal/Modal'), { loading: () => null });
