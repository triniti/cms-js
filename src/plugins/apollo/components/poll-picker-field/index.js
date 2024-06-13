import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:apollo:request:search-polls-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPollsSort.CREATED_AT_DESC.getValue(),
    autocomplete: true,
  }
});
