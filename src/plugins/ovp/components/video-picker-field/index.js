import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:ovp:request:search-videos-request', {
  channel: 'picker',
  initialData: {
    sort: SearchVideosSort.CREATED_AT_DESC.getValue(),
    autocomplete: true,
  }
});
