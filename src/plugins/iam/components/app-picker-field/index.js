import React from 'react';
import SearchAppsSort from '@gdbots/schemas/gdbots/iam/enums/SearchAppsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

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
