import React from 'react';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort';
import withRequest from 'plugins/pbjx/components/with-request';
import NodePickerField from 'plugins/ncr/components/node-picker-field';

function WidgetPickerField(props) {
  return <NodePickerField {...props} showImage={false} showType />;
}

export default withRequest(WidgetPickerField, 'triniti:curator:request:search-widgets-request', {
  channel: 'picker',
  initialData: {
    sort: SearchWidgetsSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
