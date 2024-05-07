import SearchRedirectsSort from '@triniti/schemas/triniti/sys/enums/SearchRedirectsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:sys:request:search-redirects-request', {
  channel: 'picker',
  initialData: {
    sort: SearchRedirectsSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
