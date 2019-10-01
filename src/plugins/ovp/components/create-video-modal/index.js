import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/ovp/components/create-video-modal/Modal'), { loading: () => null });
