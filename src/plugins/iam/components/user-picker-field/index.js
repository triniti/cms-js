import React from 'react';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

function UserPickerField(props) {
  return <NodePickerField {...props} showImage={false} />;
}

export default withRequest(UserPickerField, 'gdbots:iam:request:search-users-request', {
  channel: 'picker',
  initialData: {
    sort: SearchUsersSort.FIRST_NAME_ASC.getValue(),
    autocomplete: true,
  }
});
