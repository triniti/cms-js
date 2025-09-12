import React, { useMemo } from 'react';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

const GalleryPickerFieldWithStatus = (props) => {
  const { statuses, ...rest } = props;

  const GalleryPickerField = useMemo(() => {
    const initialData = {
      sort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
      autocomplete: true
    };
    
    if (statuses) {
      initialData.statuses = statuses;
    }
    
    return withRequest(NodePickerField, 'triniti:curator:request:search-galleries-request', {
      channel: 'picker',
      initialData
    });
  }, [statuses?.length, statuses?.join(',')]);
 
  return <GalleryPickerField {...rest} />;
};

export default GalleryPickerFieldWithStatus;
