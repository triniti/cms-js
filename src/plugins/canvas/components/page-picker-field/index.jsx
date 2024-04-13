import React from 'react';
import SearchPagesSort from '@triniti/schemas/triniti/canvas/enums/SearchPagesSort';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:canvas:request:search-pages-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPagesSort.CREATED_AT_ASC.getValue(),
    autocomplete: true,
  }
});
