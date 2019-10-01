import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/people/components/create-person-modal/Modal'), { loading: () => null });
