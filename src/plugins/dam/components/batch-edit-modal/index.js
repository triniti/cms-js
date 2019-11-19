import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';

export default createLazyComponent(import('@triniti/cms/plugins/dam/components/batch-edit-modal/BatchEdit'), { loading: () => null });
