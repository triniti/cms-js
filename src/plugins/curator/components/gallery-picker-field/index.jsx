import React from 'react';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:curator:request:search-galleries-request', {
  channel: 'picker',
  initialData: {
    sort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
    autocomplete: true,
  }
});
