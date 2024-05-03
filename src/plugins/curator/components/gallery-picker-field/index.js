import React from 'react';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

export default withRequest(NodePickerField, 'triniti:curator:request:search-galleries-request', {
  channel: 'picker',
  initialData: {
    sort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
    autocomplete: true,
  }
});
