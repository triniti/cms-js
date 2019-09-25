import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/boost/components/create-sponsor-modal/Modal'), { loading: () => null });
