import React from 'react';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:apollo:request:search-polls-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPollsSort.CREATED_AT_DESC.getValue(),
    autocomplete: true,
  }
});
