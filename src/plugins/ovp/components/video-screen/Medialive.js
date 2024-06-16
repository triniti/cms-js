import React from 'react';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

const Medialive = ({ nodeRef }) => {

  const { node } = useNode(nodeRef, false);

  if (!node || !node.schema().hasMixin('triniti:ovp:mixin:transcodeable')) {
    return '';
  }

  const status = node && node.has('transcoding_status') ? node.get('transcoding_status').getValue() : 'unknown';

  return (
    <div>
      <small className="text-uppercase status-copy mr-0 pr-0">
        Transcoding Status:
      </small>
      <small className={`text-uppercase status-copy mr-2 transcoding-status-${status}`}>
        {status}
      </small>
    </div>
  );
}

export default Medialive;