import React from 'react';
import SearchCategoriesSort from '@triniti/schemas/triniti/taxonomy/enums/SearchCategoriesSort';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field';

function CategoryPickerField(props) {
  return <NodePickerField {...props} showImage={false} urlTemplate="canonical" />;
}

export default withRequest(CategoryPickerField, 'triniti:taxonomy:request:search-categories-request', {
  channel: 'picker',
  initialData: {
    sort: SearchCategoriesSort.TITLE_ASC.getValue(),
    autocomplete: true,
  }
});
