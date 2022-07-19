import React from 'react';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

function AppPickerField(props) {
  return <NodePickerField {...props} showImage={false} showType />;
}

export default withRequest(AppPickerField, 'gdbots:iam:request:search-apps-request', {
  channel: 'picker',
  initialData: {
    sort: SearchAppsSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
