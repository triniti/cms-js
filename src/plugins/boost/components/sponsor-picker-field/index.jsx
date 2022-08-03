import React from 'react';
import SearchSponsorsSort from '@triniti/schemas/triniti/boost/enums/SearchSponsorsSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

function SponsorPickerField(props) {
  return <NodePickerField {...props} showImage={false} />;
}

export default withRequest(SponsorPickerField, 'triniti:boost:request:search-sponsors-request', {
  channel: 'picker',
  initialData: {
    sort: SearchSponsorsSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
