import React from 'react';
import { components } from 'react-select';
import { Badge, Media } from 'reactstrap';
import { Icon } from '@triniti/cms/components';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl'
import Loading from '@triniti/cms/components/loading';
import useNode from '@triniti/cms/plugins/ncr/components/useNode';
import damUrl from '@triniti/cms/plugins/dam/damUrl';
import brokenImage from 'assets/img/broken-image--xxs.jpg';

const noop = (event) => {
  event.stopPropagation();
};

export default function MultiValueLabel(props) {
  const { showImage = true, showLink = true, showType = false, urlTemplate = 'view' } = props.selectProps;
  const nodeRef = props.data.value;
  const { node, pbjxError } = useNode(nodeRef, false);

  if (!node) {
    const error = `${pbjxError}`.startsWith('NodeNotFound') ? `${nodeRef} not found.` : pbjxError;
    return (
      <components.MultiValueLabel {...props}>
        <Loading inline size="sm" error={error}>Loading {nodeRef}...</Loading>
      </components.MultiValueLabel>
    );
  }

  const status = `${node.get('status')}`;
  const schema = node.schema();
  const isPublishable = schema.hasMixin('gdbots:ncr:mixin:publishable');
  const url = nodeUrl(node, urlTemplate) || nodeUrl(node, 'view');

  return (
    <components.MultiValueLabel {...props}>
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
      {(showLink && (
        <a href={url} rel="noopener noreferrer" target="_blank" onMouseDown={noop} className="m-1 ms-2 me-2">
          <Icon imgSrc="external" size="sm" />
        </a>
      ))}
    </components.MultiValueLabel>
  );
}
