import { createLazyComponent } from '@triniti/admin-ui-plugin/components';

export default createLazyComponent(import('@triniti/cms/plugins/news/components/create-article-modal/Modal'), { loading: () => null });
