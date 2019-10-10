import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/pbjx/components/create-raw-view-modal/Modal'), { loading: () => null });
