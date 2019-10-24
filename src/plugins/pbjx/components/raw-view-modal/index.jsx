import createLazyComponent from '@triniti/admin-ui-plugin/components/createLazyComponent';

export default createLazyComponent(import('@triniti/cms/plugins/pbjx/components/raw-view-modal/RawViewer'), { loading: () => null });
