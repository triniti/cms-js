import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/apollo/components/create-poll-modal/Modal'), { loading: () => null });
