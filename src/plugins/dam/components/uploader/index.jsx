import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';

export default createLazyComponent(import('@triniti/cms/plugins/dam/components/uploader/Uploader'), { loading: () => null });
