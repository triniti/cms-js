import React, { useMemo } from 'react';
import SearchVideosSort from '@triniti/schemas/triniti/ovp/enums/SearchVideosSort.js';
import withRequest from '@triniti/cms/plugins/pbjx/components/with-request/index.js';
import NodePickerField from '@triniti/cms/plugins/ncr/components/node-picker-field/index.js';

const VideoPicker = (props) => {
  const { statuses, ...rest } = props;

  const VideoPickerField = useMemo(() => {
    const initialData = {
      sort: SearchVideosSort.ORDER_DATE_DESC.getValue(),
      autocomplete: true
    };

    if (statuses) {
      initialData.statuses = statuses;
    }

    return withRequest(NodePickerField, 'triniti:ovp:request:search-videos-request', {
      channel: 'picker',
      initialData
    });
  }, [statuses?.length, statuses?.join(',')]);

  return <VideoPickerField {...rest} />;
};

export default VideoPicker;