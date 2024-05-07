import SearchTimelinesSort from '@triniti/schemas/triniti/curator/enums/SearchTimelinesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:curator:request:search-timelines-request', {
  channel: 'picker',
  initialData: {
    sort: SearchTimelinesSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
