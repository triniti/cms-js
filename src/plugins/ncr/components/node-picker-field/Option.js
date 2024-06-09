import React from 'react';
import { components } from 'react-select';
import { Badge, Media } from 'reactstrap';
import Loading from '@triniti/cms/components/loading/index.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import brokenImage from '@triniti/cms/assets/img/broken-image--xxs.jpg';

export default function Option(props) {
  const { showImage = true, showType = false } = props.selectProps;
  const nodeRef = props.data.value;
  const { node, pbjxError } = useNode(nodeRef, false);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return (
      <components.Option {...props}>
        <Loading inline size="sm" error={error}>Loading {nodeRef}...</Loading>
      </components.Option>
    );
  }

  const status = `${node.get('status')}`;
  const schema = node.schema();
  const isPublishable = schema.hasMixin('gdbots:ncr:mixin:publishable');

  return (
    <components.Option {...props}>
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
      {showType && (
        <Badge pill color="light">{schema.getQName().getMessage()}</Badge>
      )}
      {(isPublishable || status === 'deleted') && (
        <Badge pill className={`status-${status}`}>{status}</Badge>
      )}
    </components.Option>
  );
}
