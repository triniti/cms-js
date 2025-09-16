import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:news:request:search-articles-request', {
  channel: 'picker',
  initialData: {
    sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
    autocomplete: true,
  }
});
