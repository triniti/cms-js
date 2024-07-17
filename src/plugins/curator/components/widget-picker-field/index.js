import React from 'react';
import SearchWidgetsSort from '@triniti/schemas/triniti/curator/enums/SearchWidgetsSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

function WidgetPickerField(props) {
  return <NodePickerField {...props} showImage={false} showType stretch />;
}

export default withRequest(WidgetPickerField, 'triniti:curator:request:search-widgets-request', {
  channel: 'picker',
  initialData: {
    sort: SearchWidgetsSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
