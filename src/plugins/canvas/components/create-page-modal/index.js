import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/canvas/components/create-page-modal/Modal'), { loading: () => null });
