import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/curator/components/create-timeline-modal/Modal'), { loading: () => null });
