import React from 'react';
import SearchPollsSort from '@triniti/schemas/triniti/apollo/enums/SearchPollsSort';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:apollo:request:search-polls-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPollsSort.CREATED_AT_DESC.getValue(),
    autocomplete: true,
  }
});
