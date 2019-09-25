import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/curator/components/create-gallery-modal/Modal'), { loading: () => null });
