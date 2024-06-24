import SearchTeasersSort from '@triniti/schemas/triniti/curator/enums/SearchTeasersSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:curator:request:search-teasers-request', {
  channel: 'picker',
  initialData: {
    sort: SearchTeasersSort.ORDER_DATE_DESC.getValue(),
    autocomplete: true,
  }
});
