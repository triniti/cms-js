import React from 'react';
import SearchTimelinesSort from '@triniti/schemas/triniti/curator/enums/SearchTimelinesSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:curator:request:search-timelines-request', {
  channel: 'picker',
  initialData: {
    sort: SearchTimelinesSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
