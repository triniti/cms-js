import React from 'react';
import SearchPeopleSort from '@triniti/schemas/triniti/people/enums/SearchPeopleSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

function PersonPickerField(props) {
  return <NodePickerField {...props} showImage={false} urlTemplate="canonical" />;
}

export default withRequest(PersonPickerField, 'triniti:people:request:search-people-request', {
  channel: 'picker',
  initialData: {
    sort: SearchPeopleSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
