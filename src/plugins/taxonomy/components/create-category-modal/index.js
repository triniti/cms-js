import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/taxonomy/components/create-category-modal/Modal'), { loading: () => null });
