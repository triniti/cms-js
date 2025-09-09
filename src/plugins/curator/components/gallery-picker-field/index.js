import React, { useMemo } from 'react';
import SearchGalleriesSort from '@triniti/schemas/triniti/curator/enums/SearchGalleriesSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';
import NodeStatus from "@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js";

const GalleryPickerFieldWithStatus = (props) => {
  const { statuses, ...otherProps } = props;
  
  const finalStatuses = statuses;
  
  const GalleryPickerField = useMemo(() => {
    const initialData = {
      sort: SearchGalleriesSort.ORDER_DATE_DESC.getValue(),
      autocomplete: true
    };
    
    if (finalStatuses) {
      initialData.statuses = finalStatuses;
    }
    
    return withRequest(NodePickerField, 'triniti:curator:request:search-galleries-request', {
      channel: 'picker',
      initialData
    });
  }, [JSON.stringify(finalStatuses)]);
 
  return <GalleryPickerField {...otherProps} />;
};

export default GalleryPickerFieldWithStatus;
