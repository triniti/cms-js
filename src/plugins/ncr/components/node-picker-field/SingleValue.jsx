import React from 'react';
import { components } from 'react-select';
import { Badge, Media } from 'reactstrap';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl'
import Loading from '@triniti/cms/components/loading';
import useNode from '@triniti/cms/plugins/ncr/components/useNode';
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import brokenImage from 'assets/img/broken-image--xxs.jpg';

const noop = (event) => {
  event.stopPropagation();
};

export default function SingleValue(props) {
  const { showImage = true, showType = false, urlTemplate = 'view' } = props.selectProps;
  const nodeRef = props.data.value;
  const { node, pbjxError } = useNode(nodeRef, false);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return (
      <components.SingleValue {...props}>
        <Loading inline size="sm" error={error}>Loading {nodeRef}...</Loading>
      </components.SingleValue>
    );
  }

  const status = `${node.get('status')}`;
  const schema = node.schema();
  const isPublishable = schema.hasMixin('gdbots:ncr:mixin:publishable');
  const url = nodeUrl(node, urlTemplate) || nodeUrl(node, 'view');

  return (
    <components.SingleValue {...props}>
      <a href={url} rel="noopener noreferrer" target="_blank" onMouseDown={noop}>
        {showImage && (
          <Media
            src={node.has('image_ref') ? damUrl(node.get('image_ref'), '1by1', 'xs') : brokenImage}
            alt=""
            width="32"
            height="32"
            object
            className="rounded-2"
          />
        )}
        <span>{node.get('title')}</span>
      </a>
      {showType && (
        <Badge pill color="light">{schema.getQName().getMessage()}</Badge>
      )}
      {(isPublishable || status === 'deleted') && (
        <Badge pill className={`status-${status}`}>{status}</Badge>
      )}
    </components.SingleValue>
  );
}
