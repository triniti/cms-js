import SearchPagesSort from '@triniti/schemas/triniti/canvas/enums/SearchPagesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:canvas:request:search-pages-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPagesSort.CREATED_AT_ASC.getValue(),
    autocomplete: true,
  }
});
