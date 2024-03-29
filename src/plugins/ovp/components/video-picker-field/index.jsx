import React from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

export default withRequest(NodePickerField, 'triniti:ovp:request:search-videos-request', {
  channel: 'picker',
  initialData: {
    sort: SearchVideosSort.CREATED_AT_DESC.getValue(),
    autocomplete: true,
  }
});
