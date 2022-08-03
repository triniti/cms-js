import React from 'react';
import SearchArticlesSort from '@triniti/schemas/triniti/news/enums/SearchArticlesSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:news:request:search-articles-request', {
  channel: 'picker',
  initialData: {
    sort: SearchArticlesSort.ORDER_DATE_DESC.getValue(),
    autocomplete: true,
  }
});
